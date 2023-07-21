import fs from "fs"
import { pipeline } from "stream/promises"
import { INPUT_PATH, OUTPUT_PATH, SEPARATOR } from "../constants"
import checkDirectory from "../utils/check-dir"
import { InputError } from "../utils/errors"
import sortChunkPipe from "./sorting-pipe"

const sortData = async () => {
    if (!fs.existsSync(INPUT_PATH)) {
        throw new InputError()
    }

    await checkDirectory(OUTPUT_PATH)

    const input = fs.createReadStream(INPUT_PATH)
    const output = fs.createWriteStream(OUTPUT_PATH)

    await pipeline(
        input,
        sortChunkPipe,
        async function* (source) {
            for await (const chunk of source) {
                const str = chunk.join(SEPARATOR)
                yield Buffer.from(
                    str.endsWith(SEPARATOR) ? str : str + SEPARATOR
                )
            }
        },
        output
    )

    input.close()
    output.close()
}

export default sortData