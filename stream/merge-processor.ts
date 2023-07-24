import { createReadStream, createWriteStream } from "fs"
import fs from "fs/promises"
import { Transform, TransformCallback } from "stream"

import { pipeline } from "stream/promises"
import { OUTPUT_PATH, SEPARATOR_OUT } from "../constants"
import FileNameBuilder from "../utils/file-name-builder"
import MergeStream from "./merge-chunk"

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
        this.outputSeparator = SEPARATOR_OUT
        this.outputPath = OUTPUT_PATH
    }

    async _transform(chunk: string[], encoding: BufferEncoding, callback: TransformCallback) {        
        await this.handleChunk(chunk)
        ++this.chunkIndex
        callback(null)
        return
    }

    async _final(callback: (error?: Error) => void) {
        try {
            await this.renameTempFile()
        } catch (err) {
            if (err.code === "ENOENT") {
                console.log(">>> Input file was empty")
            }
        }
        callback(null)
        return
    }

    async handleChunk(chunkStrings: string[]) {
        
        if (this.chunkIndex === 0) {
            await this.handleFirstChunk(chunkStrings)
            return
        }

        this.readHandle = this.getPreviousTempHandle()
        this.writeHandle = this.getNextTempHandle()
        this.mergePipe = new MergeStream(chunkStrings)

        await pipeline([
            this.readHandle,
            this.mergePipe,
            this.writeHandle
        ])

        this.handleRemainingStrings()

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

    private handleRemainingStrings() {
        if (
			this.mergePipe &&
			this.mergePipe.stringIndex < this.mergePipe.stringsToMerge.length
		) {
            this.writeHandle.write(
				this.mergePipe.stringsToMerge
					.slice(this.mergePipe.stringIndex)
					.join(this.outputSeparator) + this.outputSeparator
			)
        }
    }

    private getPreviousTempHandle() {
        const tempFileName = this.fileNameBuilder.getName(this.chunkIndex - 1)
        return createReadStream(tempFileName)
    }

    private getNextTempHandle() {
        const newTempFileName = this.fileNameBuilder.getName(this.chunkIndex)
        return createWriteStream(newTempFileName)
    }

    private async removePreviousTempFile() {
        const tempName = this.fileNameBuilder.getName(this.chunkIndex - 1)
        await fs.rm(tempName)
        return
    }

    private async renameTempFile() {
        const tempFileName = this.fileNameBuilder.getName(this.chunkIndex - 1)
        await fs.rename(tempFileName, this.outputPath)
        return
    }
}



export default MergeChunkProcessor