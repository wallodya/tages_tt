import fs from "fs"
import { pipeline } from "stream/promises"
import { INPUT_PATH, OUTPUT_PATH, SEPARATOR } from "../constants"
import checkDirectory from "../utils/check-dir"
import { InputError } from "../utils/errors"
import { MergeChunkProcessor } from "../stream/merge-chunk"
import SortChunkProcessor from "../stream/sort-chunk"

const sortData = async () => {
    if (!fs.existsSync(INPUT_PATH)) {
        throw new InputError()
    }

    await checkDirectory(OUTPUT_PATH)

    const input = fs.createReadStream(INPUT_PATH, { encoding: "utf-8" })
    const output = fs.createWriteStream(OUTPUT_PATH, { encoding: "utf-8" })

    const sortChunkProcessor = new SortChunkProcessor()
    // const sortChunkPipe = async function* (source: AsyncIterable<Buffer>) {
    //     sortChunkProcessor.pipe(source)
    // }

    const mergeChunkProcessor = new MergeChunkProcessor()
    // const mergeChunkPipe = async function* (source: AsyncIterable<string[]>) {
	// 	mergeChunkProcessor.pipe(source)
	// }


    await pipeline([
        input,
        sortChunkProcessor,
        mergeChunkProcessor,
        // output
    ])

    input.close()
    output.close()
}

export default sortData