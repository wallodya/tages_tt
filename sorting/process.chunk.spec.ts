import { processChunk } from "./process-chunk"

describe("processChunk (with space as separator)", () => {
    test("should manage empty chunk", () => {
        const inputString = ""
        const chunk = Buffer.from(inputString)
        const previousTail = ""

        const [arr, tail] = processChunk(chunk, "")
        expect(arr).toEqual([])
        expect(tail).toBe("")
    })

    test("should manage chunks split mid-string with no tail", () => {
        const inputString = "cd abcd abcd "
        const chunk = Buffer.from(inputString)
        const previousTail = "ab"

        const [arr, tail] = processChunk(chunk, previousTail)
        expect(arr).toEqual(["abcd", "abcd", "abcd"])
        expect(tail).toBe("")
    })

    test("should manage chunks split mid-string with tail", () => {
        const inputString = "cd abcd abc"
        const chunk = Buffer.from(inputString)
        const previousTail = "ab"

        const [arr, tail] = processChunk(chunk, previousTail)
        expect(arr).toEqual(["abcd", "abcd"])
        expect(tail).toBe("abc")
    })
    
    test("should manage chunks split before separator with no tail", () => {
        const inputString = " abcd abcd "
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"
        
        const [arr, tail] = processChunk(chunk, previousTail)
        expect(arr).toEqual(["abcd", "abcd", "abcd"])
        expect(tail).toBe("")
    })

    test("should manage chunks split before separator with tail", () => {
        const inputString = " abcd abcd"
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"
        
        const [arr, tail] = processChunk(chunk, previousTail)
        expect(arr).toEqual(["abcd", "abcd"])
        expect(tail).toBe("abcd")
    })

    test("should manage chunks split after separator with no tail", () => {
        const inputString = "abcd abcd"
        const chunk = Buffer.from(inputString)
        const previousTail = ""
        
        const [arr, tail] = processChunk(chunk, previousTail)

        expect(arr).toEqual(["abcd"])
        expect(tail).toBe("abcd")
    })

    test("should manage chunks split after separator with tail", () => {
        const inputString = "abcd abcd"
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"
        
        const [arr, tail] = processChunk(chunk, previousTail)

        expect(arr).toEqual(["abcdabcd"])
        expect(tail).toBe("abcd")
    })

    test("should manage single string split into chunks (ends on space)", () => {
        const inputString = "efg "
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

        const [arr, tail] = processChunk(chunk, previousTail)

        expect(arr).toEqual(["abcdefg"])
        expect(tail).toBe("")
    })
    
    test("should manage single string split into chunks (doesn't end on space)", () => {
        const inputString = "efg"
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

        const [arr, tail] = processChunk(chunk, previousTail)

        expect(arr).toEqual([])
        expect(tail).toBe("abcdefg")
    })
})