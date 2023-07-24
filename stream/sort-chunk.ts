import { TransformCallback } from "stream"
import ChunkProcessor from "./chunk-processor"

class SortChunkProcessor extends ChunkProcessor {
	constructor(...superArgs: any[]) {
		super({ objectMode: true, ...superArgs })
	}

    prepareOutput(outRaw: string[]): string[] {
        return outRaw
    }

	async handleChunk(chunkStrings: string[]) {
        chunkStrings.sort()
		return chunkStrings
	}
}

export default SortChunkProcessor
