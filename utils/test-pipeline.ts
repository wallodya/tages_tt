import StreamTest from "streamtest"

/**
 * Create mock pipeline for testing streams.
 * 
 * @date 25/07/2023 - 18:15:56
 *
 * @param {*} Stream Class that implements transform stream class
 * @param {...any[]} args Argumnets to pass to a Stream class when initializing
 * @returns Async Function which takes array of mock chunks (as strings) and returns array with chunks,
 * which were processed by provided stream
 */
const createTestPipeline = (Stream: any, ...args: any[]) => {
    
    return async (inputChunks: string[]) => {
        const processor = new Stream()
    
        return new Promise<string[][]>((resolve, reject) => {
            StreamTest.v2.fromChunks(inputChunks)
                .pipe(processor)
                .pipe(StreamTest.v2.toObjects((err, chunks: string[][]) => {
                    resolve(chunks)
                }))
        })
    }
}

export default createTestPipeline