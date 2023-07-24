import StreamTest from "streamtest"

import { TransformCallback } from "stream"
import ChunkProcessor from "./chunk-processor"
import createTestPipeline from "../utils/test-pipeline"

class TestChunkProcessor extends ChunkProcessor {
    constructor() {
        super({objectMode: true})
    }

    async handleChunk(strings: string[]): Promise<string[]> {
        return strings
    }

    prepareOutput(outRaw: string[]): string[] {
        return outRaw
    }
}

// const getResultChunks = async (inputChunks: string[]) => {
//     const processor = new TestChunkProcessor()

//     return new Promise<string[]>((resolve, reject) => {
//         StreamTest.v2.fromChunks(inputChunks)
//             .pipe(processor)
//             .pipe(StreamTest.v2.toObjects((err, chunks: string[]) => {
//                 resolve(chunks)
//             }))
//     })
// }

const getResultChunks = createTestPipeline(TestChunkProcessor)

describe("ChunkProcessor getStrings method", () => {
    test("should manage empty chunk", () => {
        const inputString = ""
        const chunk = Buffer.from(inputString)
        const previousTail = ""

        const processor = new TestChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)
        expect(strings).toEqual([])
        expect(processor.tail).toBe("")
    })

    test("should manage chunks split mid-string with no tail", () => {
        const inputString = "cd abcd abcd "
        const chunk = Buffer.from(inputString)
        const previousTail = "ab"

        const processor = new TestChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)
        expect(strings ).toEqual(["abcd", "abcd", "abcd"])
        expect(processor.tail).toBe("")
    })

    test("should manage chunks split mid-string with tail", () => {
        const inputString = "cd abcd abc"
        const chunk = Buffer.from(inputString)
        const previousTail = "ab"

        const processor = new TestChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)
        expect(strings).toEqual(["abcd", "abcd"])
        expect(processor.tail).toBe("abc")
    })
    
    test("should manage chunks split before separator with no tail", () => {
        const inputString = " abcd abcd "
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

        const processor = new TestChunkProcessor()
        processor.tail = previousTail
        
        const strings = processor.getStrings(chunk)
        expect(strings).toEqual(["abcd", "abcd", "abcd"])
        expect(processor.tail).toBe("")
    })

    test("should manage chunks split before separator with tail", () => {
        const inputString = " abcd abcd"
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

                const processor = new TestChunkProcessor()
        processor.tail = previousTail
        
        const strings = processor.getStrings(chunk)
        expect(strings).toEqual(["abcd", "abcd"])
        expect(processor.tail).toBe("abcd")
    })

    test("should manage chunks split after separator with no tail", () => {
        const inputString = "abcd abcd"
        const chunk = Buffer.from(inputString)
        const previousTail = ""

                const processor = new TestChunkProcessor()
        processor.tail = previousTail
        
        const strings = processor.getStrings(chunk)

        expect(strings).toEqual(["abcd"])
        expect(processor.tail).toBe("abcd")
    })

    test("should manage chunks split after separator with tail", () => {
        const inputString = "abcd abcd"
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

                const processor = new TestChunkProcessor()
        processor.tail = previousTail
        
        const strings = processor.getStrings(chunk)

        expect(strings).toEqual(["abcdabcd"])
        expect(processor.tail).toBe("abcd")
    })

    test("should manage single string split into chunks (ends on space)", () => {
        const inputString = "efg "
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

                const processor = new TestChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)

        expect(strings).toEqual(["abcdefg"])
        expect(processor.tail).toBe("")
    })
    
    test("should manage single string split into chunks (doesn't end on space)", () => {
        const inputString = "efg"
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

        const processor = new TestChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)

        expect(strings).toEqual([])
        expect(processor.tail).toBe("abcdefg")
    })
})

describe("ChunkProcessor stream", () => {
    test("should manage empty input", async () => {
        const chunks = await getResultChunks([])

        expect(chunks).toEqual([])
    })

    test("should manage single chunk (ends on separator)", async () => {
        const chunks = await getResultChunks([
            "ab cd ef g "
        ])

        expect(chunks).toEqual([["ab", "cd", "ef", "g"]])
    })

    test("should manage single chunk (does not end on separator)", async () => {
        const chunks = await getResultChunks([
            "ab cd ef g"
        ])

        expect(chunks).toEqual([["ab", "cd", "ef"], ["g"]])
    })

    test("should manage mutltiple chunks", async () => {
        const chunks = await getResultChunks([
            "ab cd ef g ",
            "h ij kl "
        ])
        expect(chunks).toEqual([
            ["ab", "cd", "ef", "g"],
            ["h", "ij", "kl"]
        ])
    })

    test("should manage mutltiple chunks (split mid-string)", async () => {
        const chunks = await getResultChunks([
            "ab cd ef g",
            "h ij kl "
        ])

        expect(chunks).toEqual([
            ["ab", "cd", "ef"],
            ["gh", "ij", "kl"]
        ])
    })

    test("should manage mutltiple chunks (split mid-string, does not end on separator)", async () => {
        const chunks = await getResultChunks([
            "ab cd ef g",
            "h ij kl"
        ])

        expect(chunks).toEqual([
            ["ab", "cd", "ef"],
            ["gh", "ij"],
            ["kl"]
        ])
    })

    test("should manage special symbols", async () => {
        const chunks = await getResultChunks([
            "%$ & ;,,, , ",
            "!@. > .\n",
            "; ^&* ()) ",
            "\n. (\t) ...,,###\n<>\n. \tdef(a:int)->None"
        ])

        expect(chunks).toEqual([
            ["%$", "&", ";,,,", ","],
            ["!@.", ">"],
            [".\n;", "^&*", "())"],
            ["\n.", "(\t)", "...,,###\n<>\n."],
            ["\tdef(a:int)->None"]
        ])
    })
})