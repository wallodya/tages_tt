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
		super._final(callback)
	}

	prepareOutput(outRaw: string[]): string[] {
		return outRaw
	}

	async handleChunk(chunkStrings: string[]) {
		this.itemsCount += chunkStrings.length
		return SortChunkProcessor.sortStrings(chunkStrings)
	}

    static sortStrings(arr: string[]): string[] {

        if (arr.length === 1) {
            return arr
		}

        const mid = Math.floor(arr.length / 2)

        const left = SortChunkProcessor.sortStrings(arr.slice(0, mid))
        const right = SortChunkProcessor.sortStrings(arr.slice(mid))

        return SortChunkProcessor.mergeSorted(left, right)
	}

    static mergeSorted(arr1: string[], arr2: string[]) {

        let i = 0
        let j = 0

		const pointersValid = () => {
            return i < arr1.length && j < arr2.length
		}

		while (pointersValid()) {
            while(pointersValid() && arr1[i] <= arr2[j]) {
				++i
			}
            while(pointersValid() && arr1[i] > arr2[j] ) {
                arr1.splice(i, 0, arr2[j])
				++j
				++i
			}
		}

        if (j < arr2.length) {
            arr1.push(...arr2.slice(j))
		}

        return arr1
	}
}

export default SortChunkProcessor
