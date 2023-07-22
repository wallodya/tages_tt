import { SEPARATOR } from "../constants"
import { Transform, TransformCallback } from "stream"

class SortChunkProcessor extends Transform {
	tail: string
	separator: string
	constructor(...superArgs: any[]) {
		super({ objectMode: true, ...superArgs })
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
            this.passToCallback(result, callback)
            return
		}

		if (this.tail.length > 0) {
			this.passToCallback([this.tail], callback)
            return
		}
	}

    passToCallback(strings: string[], cb: TransformCallback) {
        cb(null, strings)
        return
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
        chunkStrings.sort()
		return chunkStrings
	}
}

export default SortChunkProcessor
