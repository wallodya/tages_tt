import { TransformCallback } from "stream"
import { SEPARATOR_OUT } from "../constants"
import ChunkProcessor from "./chunk-processor"

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

	passToCallback(strings: string[], cb: TransformCallback): void {
		console.log(">>> Passing to callback")
		cb(null, strings.join(this.outputSeparator) + this.outputSeparator)
		return
	}

	async handleChunk(chunkStrings: string[]): Promise<string[]> {
		console.log(">>> Merging chunk")

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
}

export default MergeStream
