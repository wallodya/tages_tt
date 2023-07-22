import fs from "fs/promises"
import { createReadStream, createWriteStream } from "fs"
import { Transform, TransformCallback } from "stream"

import { pipeline } from "stream/promises"
import { DATA_DIR_PATH, OUTPUT_PATH, SEPARATOR } from "../constants"
import FileNameBuilder from "../utils/file-name-builder"
import ChunkProcessor from "./chunk-processor"
import SortChunkProcessor from "./chunk-processor"

class MergeStream extends SortChunkProcessor {
    stringsToMerge: string[]
    first: boolean
    outputSeparator: string
    stringIndex: number

	constructor(strings: string[]) {
		super({
            writableHighWaterMark: 128
        })
        this.stringsToMerge = strings
        this.first = true
        this.outputSeparator = SEPARATOR
        this.stringIndex = 0
	}

    passToCallback(strings: string[], cb: TransformCallback): void {
        cb(null, strings.join(this.outputSeparator))
        return
    }

    async handleChunk(chunkStrings: string[]): Promise<string[]> {
        if (
			this.stringsToMerge.length === 0 ||
			this.stringIndex >= this.stringsToMerge.length
		) {
			return chunkStrings
		}

        if (chunkStrings.length === 0) {
            return this.stringsToMerge.slice(this.stringIndex)
        }

        let j = 0

        const pointersValid = () => {
            return j < chunkStrings.length &&
			this.stringIndex < this.stringsToMerge.length
        }

        while (pointersValid()) {
			while (
				pointersValid() &&
				this.stringsToMerge[this.stringIndex] > chunkStrings[j]
			) {
				++j
			}

			while (
                pointersValid() &&
                this.stringsToMerge[this.stringIndex] <= chunkStrings[j]
            ) {
                chunkStrings.splice(j, 0, this.stringsToMerge[this.stringIndex])
				++j
				++this.stringIndex
			}
		}

        return chunkStrings
    }
}

export class MergeChunkProcessor extends Transform {
    fileNameBuilder: FileNameBuilder
    chunkIndex: number
    outputSeparator: string
    outputPath: string
    mergePipe: MergeStream
    readHandle: ReturnType<typeof createReadStream>
    writeHandle: ReturnType<typeof createWriteStream>
    constructor() {
        super({ objectMode: true })
        this.fileNameBuilder = new FileNameBuilder()
        this.chunkIndex = 0
        this.outputSeparator = SEPARATOR
        this.outputPath = OUTPUT_PATH
    }

    async _transform(chunk: string[], encoding: BufferEncoding, callback: TransformCallback) {
        console.log(">>> Merge transform", this.chunkIndex);
        
        await this.handleChunk(chunk)
        ++this.chunkIndex
        callback(null)
        return
    }

    async _final(callback: (error?: Error) => void) {
        await this.renameTempFile()
        callback(null)
        return
    }

    async handleChunk(chunkStrings: string[]) {
        console.log(`>>> Handling chunk ${this.chunkIndex}. Length: ${chunkStrings.length}`);
        
        if (this.chunkIndex === 0) {
            await this.handleFirstChunk(chunkStrings)
            return
        }

        this.readHandle = this.getPreviousTempHandle()
        this.writeHandle = this.getNextTempHandle()
        this.mergePipe = new MergeStream(chunkStrings)

        await pipeline(
            this.readHandle,
            this.mergePipe,
            this.writeHandle
        )

        if (
			this.mergePipe &&
			this.mergePipe.stringIndex < this.mergePipe.stringsToMerge.length
		) {
            this.writeHandle.write(
				this.mergePipe.stringsToMerge
					.slice(this.mergePipe.stringIndex)
					.join(this.outputSeparator)
			)
        }

		this.readHandle.close()
        this.writeHandle.close()

        await this.removePreviousTempFile()
    }

    async handleFirstChunk(chunkStrings: string[]) {
        this.writeHandle = this.getNextTempHandle()
        this.writeHandle.write(chunkStrings.join(this.outputSeparator))
        this.writeHandle.close()
        return
    }

    getPreviousTempHandle() {
        const tempFileName = this.fileNameBuilder.getName(this.chunkIndex - 1)
        return createReadStream(tempFileName)
    }

    getNextTempHandle() {
        const newTempFileName = this.fileNameBuilder.getName(this.chunkIndex)
        return createWriteStream(newTempFileName)
    }

    async removePreviousTempFile() {
        const tempName = this.fileNameBuilder.getName(this.chunkIndex - 1)
        await fs.rm(tempName)
        return
    }

    async renameTempFile() {
        const tempFileName = this.fileNameBuilder.getName(this.chunkIndex - 1)
        await fs.rename(tempFileName, this.outputPath)
        return
    }
}



export default MergeChunkProcessor