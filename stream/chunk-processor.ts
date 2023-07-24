import { Transform, TransformCallback, TransformOptions } from "stream"
import { SEPARATOR_IN } from "../constants"

abstract class ChunkProcessor extends Transform {
	tail: string
	inputSeparator: string
	constructor(streamOptions?: TransformOptions) {
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
            callback(null, this.prepareOutput(result))
			return
		}

        callback(null, this.prepareOutput(strings))
        return
	}

    _final(callback: (error?: Error) => void): void {

        if (this.tail.length > 0) {
            this.push(this.prepareOutput([this.tail]))
        }

        callback(null)
    }

	getStrings(chunk: Buffer) {
		let chunkString = chunk.toString("utf-8")

		if (this.tail.length) {
			chunkString = this.tail + chunkString
		}

		const strings = chunkString.split(this.inputSeparator)

		this.tail = strings.pop() ?? ""

		return strings
	}

	abstract handleChunk(strings: string[]): unknown

    abstract prepareOutput(outRaw: ReturnType<typeof this.handleChunk>): unknown

}

export default ChunkProcessor