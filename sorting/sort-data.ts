import fs from "fs"
import { pipeline } from "stream/promises"
import { INPUT_PATH, OUTPUT_PATH } from "../constants"
import checkDirectory from "../utils/check-dir"
import { InputError } from "../utils/errors"
import { MergeChunkProcessor } from "../stream/merge-processor"
import SortChunkProcessor from "../stream/sort-chunk"

const sortData = async () => {
    if (!fs.existsSync(INPUT_PATH)) {
        throw new InputError()
    }

    await checkDirectory(OUTPUT_PATH)

    const input = fs.createReadStream(INPUT_PATH, { encoding: "utf-8" })
    const output = fs.createWriteStream(OUTPUT_PATH, { encoding: "utf-8" })

    const sortChunkProcessor = new SortChunkProcessor()
    const mergeChunkProcessor = new MergeChunkProcessor()


    await pipeline([
        input,
        sortChunkProcessor,
        mergeChunkProcessor
    ])
    input.close()
    output.close()

    return
}

export default sortData