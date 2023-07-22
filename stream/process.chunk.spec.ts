import { SortChunkProcessor } from "./sort-chunk"


describe("ChunkProcessor (space as separator)", () => {
    test("should manage empty chunk", () => {
        const inputString = ""
        const chunk = Buffer.from(inputString)
        const previousTail = ""

        const processor = new SortChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)
        expect(strings).toEqual([])
        expect(processor.tail).toBe("")
    })

    test("should manage chunks split mid-string with no tail", () => {
        const inputString = "cd abcd abcd "
        const chunk = Buffer.from(inputString)
        const previousTail = "ab"

        const processor = new SortChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)
        expect(strings ).toEqual(["abcd", "abcd", "abcd"])
        expect(processor.tail).toBe("")
    })

    test("should manage chunks split mid-string with tail", () => {
        const inputString = "cd abcd abc"
        const chunk = Buffer.from(inputString)
        const previousTail = "ab"

        const processor = new SortChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)
        expect(strings).toEqual(["abcd", "abcd"])
        expect(processor.tail).toBe("abc")
    })
    
    test("should manage chunks split before separator with no tail", () => {
        const inputString = " abcd abcd "
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

        const processor = new SortChunkProcessor()
        processor.tail = previousTail
        
        const strings = processor.getStrings(chunk)
        expect(strings).toEqual(["abcd", "abcd", "abcd"])
        expect(processor.tail).toBe("")
    })

    test("should manage chunks split before separator with tail", () => {
        const inputString = " abcd abcd"
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

                const processor = new SortChunkProcessor()
        processor.tail = previousTail
        
        const strings = processor.getStrings(chunk)
        expect(strings).toEqual(["abcd", "abcd"])
        expect(processor.tail).toBe("abcd")
    })

    test("should manage chunks split after separator with no tail", () => {
        const inputString = "abcd abcd"
        const chunk = Buffer.from(inputString)
        const previousTail = ""

                const processor = new SortChunkProcessor()
        processor.tail = previousTail
        
        const strings = processor.getStrings(chunk)

        expect(strings).toEqual(["abcd"])
        expect(processor.tail).toBe("abcd")
    })

    test("should manage chunks split after separator with tail", () => {
        const inputString = "abcd abcd"
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

                const processor = new SortChunkProcessor()
        processor.tail = previousTail
        
        const strings = processor.getStrings(chunk)

        expect(strings).toEqual(["abcdabcd"])
        expect(processor.tail).toBe("abcd")
    })

    test("should manage single string split into chunks (ends on space)", () => {
        const inputString = "efg "
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

                const processor = new SortChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)

        expect(strings).toEqual(["abcdefg"])
        expect(processor.tail).toBe("")
    })
    
    test("should manage single string split into chunks (doesn't end on space)", () => {
        const inputString = "efg"
        const chunk = Buffer.from(inputString)
        const previousTail = "abcd"

                const processor = new SortChunkProcessor()
        processor.tail = previousTail

        const strings = processor.getStrings(chunk)

        expect(strings).toEqual([])
        expect(processor.tail).toBe("abcdefg")
    })
})