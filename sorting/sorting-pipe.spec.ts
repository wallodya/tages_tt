import { SortChunkProcessor } from "../stream/sort-chunk"

const createTestInputIterable = (strings: string[]): AsyncIterable<Buffer> => {
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

describe("sortChunkPipe", () => {
	test("should manage empty input", async () => {
		const testIterable = createTestInputIterable([])
		const sortChunkIter = new SortChunkProcessor().pipe(testIterable)

		expect(await sortChunkIter.next()).toEqual({
			done: true,
			value: undefined,
		})
	})

	test("should manage single chunk with one string (ends on separator)", async () => {
		const testIterable = createTestInputIterable(["abcd "])

		const sortChunkIter = new SortChunkProcessor().pipe(testIterable)

		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["abcd"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: true,
			value: undefined,
		})
	})

	test("should manage single chunk with one string (doesn't end on separator)", async () => {
		const testIterable = createTestInputIterable(["abcd"])

		const sortChunkIter = new SortChunkProcessor().pipe(testIterable)

		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["abcd"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: true,
			value: undefined,
		})
	})

	test("should manage single chunk with multiple strings (ends on separator)", async () => {
		const testIterable = createTestInputIterable(["0 6 8 7 3 2 "])
		const sortChunkIter = new SortChunkProcessor().pipe(testIterable)

		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["0", "2", "3", "6", "7", "8"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: true,
			value: undefined,
		})
	})

	test("should manage single chunk with multiple strings (does not end on separator)", async () => {
		const testIterable = createTestInputIterable(["0 6 8 7 3 2"])
		const sortChunkIter = new SortChunkProcessor().pipe(testIterable)

		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["0", "3", "6", "7", "8"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["2"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: true,
			value: undefined,
		})
	})

	test("should manage multiple chunks", async () => {
		const testIterable = createTestInputIterable([
			"2 34 3",
			"2 45 56 ",
			"6 7 9 3 34 ",
			"21 12 23",
			"4",
		])

		const sortChunkIter = new SortChunkProcessor().pipe(testIterable)

		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["2", "34"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["32", "45", "56"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["3", "34", "6", "7", "9"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["12", "21"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: false,
			value: ["234"],
		})
		expect(await sortChunkIter.next()).toEqual({
			done: true,
			value: undefined,
		})
	})
})
