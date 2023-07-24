import CheckSortedProcessor from "./check-file"

describe("checkSorted", () => {
    test("should return true if array is sorted", () => {
        expect(CheckSortedProcessor.checkSorted(["1", "2", "3", "4"])).toEqual([])
    })
    test("should return true if array is sorted, with letters", () => {
        expect(CheckSortedProcessor.checkSorted(["a", "b", "c", "d"])).toEqual([])
    })
    test("should return true if array is sorted, with different case letters", () => {
        expect(CheckSortedProcessor.checkSorted(["Z", "Z", "a", "b"])).toEqual([])
    })
    test("should return true if array is sorted, with letters and numbers", () => {
        expect(CheckSortedProcessor.checkSorted(["0", "2", "V", "a"])).toEqual([])
    })

    test("should return false if array is not sorted", () => {
        expect(CheckSortedProcessor.checkSorted(["1", "2", "4", "3"]).length).not.toBe(0)
    })
    test("should return false if array is not sorted. with letters", () => {
        expect(CheckSortedProcessor.checkSorted(["a", "b", "d", "c"]).length).not.toBe(0)
    })
    test("should return false if array is not sorted, with different case letters", () => {
        expect(CheckSortedProcessor.checkSorted(["a", "Z", "b", "Z"]).length).not.toBe(0)
    })
    test("should return false if array is not sorted, with letters and numbers", () => {
        expect(CheckSortedProcessor.checkSorted(["0", "2", "a", "V"]).length).not.toBe(0)
    })
})