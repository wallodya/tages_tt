import { Transform, TransformCallback, TransformOptions } from "stream"
import { SEPARATOR_IN } from "../constants"

abstract class ChunkProcessor extends Transform {
	tail: string
	inputSeparator: string
	constructor(streamOptions: TransformOptions) {
		super({ ...streamOptions })
		this.tail = ""
		this.inputSeparator = SEPARATOR_IN
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

		// if (this.tail.length > 0) {
		// 	this.passToCallback([this.tail], callback)
		//     return
		// }
        this.passToCallback([], callback)
        return
	}

	getStrings(chunk: Buffer) {
		let chunkString = chunk.toString("utf-8")
        console.log(">>> chunkstring: ", chunkString.length)
		if (this.tail.length) {
			chunkString = this.tail + chunkString
		}

		const strings = chunkString.split(this.inputSeparator)

		this.tail = strings.pop() ?? ""

		return strings
	}

	abstract handleChunk(strings: string[]): unknown

	abstract passToCallback(
		result: ReturnType<typeof this.handleChunk>,
		callback: TransformCallback
	): void
}

export default ChunkProcessor