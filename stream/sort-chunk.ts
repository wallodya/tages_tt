import { SEPARATOR } from "../constants"
import { Transform, TransformCallback } from "stream"

class SortChunkProcessor extends Transform {
	tail: string
	separator: string
	constructor() {
		super({ objectMode: true })
		this.tail = ""
		this.separator = SEPARATOR
	}

	async _transform(
		chunk: Buffer,
		encoding: BufferEncoding,
		callback: TransformCallback
	) {
		const strings = this.getStrings(chunk)

		if (strings.length > 0) {
			const result = await this.handleChunk(strings)
			callback(null, result)
			return
		}

		if (this.tail.length > 0) {
			callback(null, [this.tail])
			return
		}
	}

	getStrings(chunk: Buffer) {
		let chunkString = chunk.toString("utf-8")

		if (this.tail.length) {
			chunkString = this.tail + chunkString
		}

		const strings = chunkString.split(SEPARATOR)

		this.tail = strings.pop() ?? ""

		return strings
	}

	async handleChunk(chunkStrings: string[]) {
        console.log(">>>Sorting chunk. Length: ", chunkStrings.length)
		chunkStrings.sort()
		return chunkStrings
	}
}

export default SortChunkProcessor
