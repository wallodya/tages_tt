import { processChunk, sortChunk } from "./process-chunk"

const sortChunkPipe = async function* (source: AsyncIterable<Buffer>) {
    let previousTail = ""

    for await(const chunk of source) {

        const [ strings, chunkTail ] = processChunk(chunk, previousTail)
        previousTail = chunkTail

        if (strings.length > 0) {
            yield sortChunk(strings)
        }
    }

    if (previousTail.length > 0) {
        yield [ previousTail ]
    }
}

export const createTestInputIterable = (strings: string[]): AsyncIterable<Buffer> => {
    const chunks = strings.map(Buffer.from)

    return {
        [Symbol.asyncIterator]() {
            return {
                i: 0,
                next() {

                    if (this.i >= chunks.length) {
                        return Promise.resolve({
                            done: true, value: undefined
                        })
                    }

                    const result = Promise.resolve({
						value: chunks[this.i],
						done: false,
					})

                    ++this.i
                    return result
                }
            }
        }
    };
}

export default sortChunkPipe