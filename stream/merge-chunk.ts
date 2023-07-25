import { SEPARATOR_OUT } from "../constants"
import ChunkProcessor from "./chunk-processor"


/**
 * Inherits from ChunkProcessor, used to merge sorted chunk
 * with chunks which were previously sorted and saved to a temp file. 
 * New chunk is passed to a constructor stored as a parameter.
 * @date 25/07/2023 - 18:37:28
 *
 * @param {string[]} srtings Strings that need to be merged into previously sorted strings.
 * 
 * @class MergeStream
 * @type {MergeStream}
 * @extends {ChunkProcessor}
 */
class MergeStream extends ChunkProcessor {
	stringsToMerge: string[]
	first: boolean
	outputSeparator: string
	stringIndex: number

	constructor(strings: string[]) {
		super({
			writableHighWaterMark: 128,
		})
		this.stringsToMerge = strings
		this.first = true
		this.outputSeparator = SEPARATOR_OUT
        this.inputSeparator = SEPARATOR_OUT
		this.stringIndex = 0
	}

    _final(callback: (error?: Error) => void): void {

        this.handleReaminingTail()
        this.handleRemainingStrings()

        callback(null)
    }

    prepareOutput(outRaw: string[]): string {
        return outRaw.join(this.outputSeparator) + this.outputSeparator
    }

	handleChunk(chunkStrings: string[]): string[] {

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
			return (
				j < chunkStrings.length &&
				this.stringIndex < this.stringsToMerge.length
			)
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

    private handleReaminingTail() {
        if (this.tail.length > 0) {
            this.push(
                this.prepareOutput(this.handleChunk([this.tail]))
            )
        }
        return
    }

    private handleRemainingStrings() {
        if (this.stringIndex < this.stringsToMerge.length) {
            this.push(
				this.prepareOutput(this.stringsToMerge.slice(this.stringIndex))
			)
        }
        return
    }
}

export default MergeStream
