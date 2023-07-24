import { SEPARATOR_TEST } from "../constants";
import MockDataCreator from "../utils/mock-data";
import createTestPipeline from "../utils/test-pipeline";
import SortChunkProcessor from "./sort-chunk";

const getResultChunks = createTestPipeline(SortChunkProcessor)

describe("SortChunkProcessor", () => {
    test("should handle empty input", async () => {
        const chunks = await getResultChunks([])

        expect(chunks).toEqual([])
    })

    test("should handle 1 chunk with 1 uninterrupted string", async () => {
        const chunks = await getResultChunks([
            "abcdefg "
        ])

        expect(chunks).toEqual([["abcdefg"]])
    })

    test("should handle 1 chunk with 1 interrupted string", async () => {
        const chunks = await getResultChunks([
            "abcdefg"
        ])

        expect(chunks).toEqual([[], ["abcdefg"]])
    })

    test("should handle 1 chunk with multiple strings", async () => {
        const chunks = await getResultChunks([
            "b d c g f a "
        ])

        expect(chunks).toEqual([["a", "b", "c", "d", "f", "g"]])
    })

    test("should handle 1 chunk with multiple strings, interrupted", async () => {
        const chunks = await getResultChunks([
            "b d c g f a"
        ])

        expect(chunks).toEqual([[ "b", "c", "d", "f", "g"], ["a"]])
    })

    test("should handle multiple chunks", async () => {
        const chunks = await getResultChunks([
            "c a",
            "b cd ef ",
            "ij gh ",
            "qr lm op"
        ])

        expect(chunks).toEqual([
            ["c"],
            ["ab", "cd", "ef"],
            ["gh", "ij"],
            ["lm", "qr"],
            ["op"]
        ])
    })
})

// describe("SortChunkProcessor, sorting", () => {

//     test("should sort array with single item", () => {
//         const result = SortChunkProcessor.sortStrings(["a"])

//         expect(result).toEqual(["a"])
//     })

//     test("should arr with multiple letters", () => {
//         const result = SortChunkProcessor.sortStrings(["b", "a", "c", "g", "d"])

//         expect(result).toEqual(["a", "b", "c", "d", "g"])
//     })

//     test("should arr with multiple numbers", () => {
//         const result = SortChunkProcessor.sortStrings(["9", "5", "4", "1", "3", "6", "8", "7"])

//         expect(result).toEqual(["1", "3", "4", "5", "6", "7", "8", "9"])
//     })
// })

// describe("SortChunkProcessor, sorting, random tests", () => {
//     const TEST_AMOUNT = 20
//     const SEPARATOR = SEPARATOR_TEST

//     const dataCreator = new MockDataCreator({
//         separator: SEPARATOR,
//     })

//     for (let i = 0; i < TEST_AMOUNT; ++i) {
//         const data = dataCreator.createArray(10)
//         const result = SortChunkProcessor.sortStrings(data)

//         data.sort()
//         expect(result).toEqual(data)
//     }
// })

describe("SortChunkProcessor, random tests", () => {
    const TEST_AMOUNT = 20
    const SEPARATOR = SEPARATOR_TEST

    const formatReturnedResult = (res: string[][], sep: string) => {
        return res.flat().join(sep)
    }

    const dataCreator = new MockDataCreator({
        separator: SEPARATOR,
    })

    for (let i = 0; i < TEST_AMOUNT; ++i) {

        test(`random test ${i}, should not loose any data`, async () => {
            const { chunks: inputChunks, data} = dataCreator.createDataChunks(100, 8)

            const resultChunks = await getResultChunks(inputChunks)
            const result = formatReturnedResult(resultChunks, SEPARATOR)

            expect(result).toHaveLength(data.length)
        })
    }
})