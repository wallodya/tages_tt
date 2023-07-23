import { TransformCallback } from "stream"
import ChunkProcessor from "./chunk-processor"

class SortChunkProcessor extends ChunkProcessor {
	constructor(...superArgs: any[]) {
		super({ objectMode: true, ...superArgs })
	}

    // _final(callback: (error?: Error) => void): void {
    //     if (this.tail.length > 0) {
	// 		console.log("||| Unprocessed tail: ", this.tail)
    //         return
	// 	}
    //     callback(null)
    // }

    passToCallback(strings: string[], cb: TransformCallback) {
        cb(null, strings)
        return
    }

	async handleChunk(chunkStrings: string[]) {
        chunkStrings.sort()
		return chunkStrings
	}
}

export default SortChunkProcessor
