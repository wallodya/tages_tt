import fs from "fs"
import { pipeline } from "stream/promises"
import ChunkProcessor from "../stream/chunk-processor"
import { OUTPUT_PATH, SEPARATOR_OUT, TEST_RESULT_PATH } from "../constants"

type SortErrorInfo = {
    firstEl: string,
    firstElIndex: number
    secondEl: string,
    secondElIndex: number
}

class CheckSortedProcessor extends ChunkProcessor {
    chunkStart: string
    chunkEnd: string
    chunkIndex: number
    itemCount: number

    constructor() {
        super({objectMode: true})
        this.inputSeparator = SEPARATOR_OUT
        this.chunkIndex = 0
        this.itemCount = 0
    }

    _final(callback: (error?: Error) => void): void {
        this.push(`||| Items checked: ${this.itemCount}`)
        callback(null)
    }

    handleChunk(strings: string[]): string {
        const chunkErrors = CheckSortedProcessor.checkSorted(strings)

        this.itemCount += strings.length

        if (chunkErrors.length === 0) {
            ++this.chunkIndex
            return this.getChunkSuccessString()
        }

        const errorMessages = chunkErrors.map(e => this.getErrorInfoString(e))
        ++this.chunkIndex
        return this.wrapChunkErrorMessages(errorMessages)
    }

    private getChunkSuccessString() {
        return `>>> Chunk ${this.chunkIndex} is sorted properly\n`
    }

    private wrapChunkErrorMessages(messages: string[]) {
        const border = Array(20).fill("#").join("") + "\n"
        const result = border +
            `#\tErrors in chunk ${this.chunkIndex}\n` +
            messages.map(
                m => `#\t${m}\n`
            ).join("\n") + 
            border
        return result
    }

    private getErrorInfoString(err: SortErrorInfo) {
        return `Element < ${err.secondEl} > at position ${err.secondElIndex} is smaller than element < ${err.firstEl} > at position ${err.firstElIndex}`
    }

    prepareOutput(outRaw: string): string {
        return outRaw
    }

    
    static checkSorted(arr: string[]) {
        if (arr.length <= 1) {
            return []
        }
    
        let errors: SortErrorInfo[] = []
    
        for (let i = 1; i < arr.length; ++i) {
            if (arr[i] < arr[i - 1]) {
                const info: SortErrorInfo = {
                    firstEl: arr[i - 1],
                    firstElIndex: i - 1,
                    secondEl: arr[i],
                    secondElIndex: i
                }
                errors.push(info)
            }
        }
    
        return errors
    }
}

const checkFile = async (path: string) => {

    const input = fs.createReadStream(path)
    const output = fs.createWriteStream(TEST_RESULT_PATH)

    const checkChunkProcessor = new CheckSortedProcessor()

    await pipeline([
        input,
        checkChunkProcessor,
        output
    ])

    return
}

if (process.env["TEST"] !== "true") {
    checkFile(OUTPUT_PATH)
}

export default CheckSortedProcessor