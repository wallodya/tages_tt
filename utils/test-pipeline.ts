import StreamTest from "streamtest"
import { Transform } from "stream"

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