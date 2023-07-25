import { Transform, TransformCallback, TransformOptions } from "stream"
import { SEPARATOR_IN } from "../constants"


/**
 * Modified transform stream (inherits from Transform class).
 * Can be used to handle files with strings separated by some character (for example space).
 * When extending this class handleChunk and prepareOutput methods MUST be implemented.
 * _transform will automatically transform chunks and pass them to handleChunk method as an array of strings,
 * After whatever was returned by handleChunk will be passed to prepareOutput method and then to a callback.
 * 
 * @date 25/07/2023 - 18:27:49
 *
 * @abstract
 * 
 * @param {TransformOptions} streamOptions Options to pass to parent constructor
 * 
 * @class ChunkProcessor
 * @type {ChunkProcessor}
 * @extends {Transform}
 */
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

    
	/**
     * Actions to perform on data chunks.
     * @date 25/07/2023 - 18:33:53
     *
     * @abstract
     * @param {string[]} strings
     * @returns {unknown}
     */
    abstract handleChunk(strings: string[]): unknown

    
    /**
     * Modifies data before passing it to a next stream.
     * For example: you can join array of strings before passing it to a WriteStream 
     * @date 25/07/2023 - 18:34:34
     *
     * @abstract
     * @param {ReturnType<typeof this.handleChunk>} outRaw
     * @returns {unknown}
     */
    abstract prepareOutput(outRaw: ReturnType<typeof this.handleChunk>): unknown

}

export default ChunkProcessor