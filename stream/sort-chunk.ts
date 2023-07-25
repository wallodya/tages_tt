import { TransformCallback } from "stream"
import ChunkProcessor from "./chunk-processor"

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
