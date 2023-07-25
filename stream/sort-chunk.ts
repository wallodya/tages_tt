import { TransformCallback } from "stream"
import ChunkProcessor from "./chunk-processor"


/**
 * Inherits from ChunkProcessor and adds sotring logic to it.
 * Passes chunk as an array of sorted strings to a next stream in a pipeline
 * @date 25/07/2023 - 18:36:05
 *
 * @class SortChunkProcessor
 * @type {SortChunkProcessor}
 * @extends {ChunkProcessor}
 */
class SortChunkProcessor extends ChunkProcessor {
    itemsCount: number
	constructor(...superArgs: any[]) {
		super({ objectMode: true, ...superArgs })
        this.itemsCount = 0
	}

    _final(callback: (error?: Error) => void): void {
        console.log(">>> Items sotred: ", this.itemsCount)
        super._final(callback)        
    }

    prepareOutput(outRaw: string[]): string[] {
        return outRaw
    }

	async handleChunk(chunkStrings: string[]) {
        this.itemsCount += chunkStrings.length
        chunkStrings.sort()
		return chunkStrings
	}

    static sortStrings(arr: string[]) {
        return arr
    }
}

export default SortChunkProcessor
