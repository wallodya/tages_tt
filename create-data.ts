import fs from "fs"
import checkDirectory from "./utils/check-dir"
import RandomStringGenerator from "./utils/random"
import { INPUT_PATH, MOCK_DATA_AMOUNT, SEPARATOR_IN } from "./constants"

type CreateDataArgs = {
    path: string,
    amount: number,
    separator: string,
    generator: RandomStringGenerator
}

/** 
 * Creates file (about 1 GB in size)
 * with strings separated by space,
 * 
*/
const createData = async ({
	path,
	amount,
    separator,
    generator
}: CreateDataArgs) => {
	console.log(`>>> Creating test data at "${path}"...`)
	console.time("||| Time: ")

	await checkDirectory(path)

	const stream = fs.createWriteStream(path)

    let i = 0

    const writeStrings = () => {
        while (i < amount) {
            const randomString = generator.getRandomString()
            const buffer = Buffer.from(randomString + separator, "utf-8")
            if (!stream.write(buffer)) {
                break
            }
            ++i
        }
        if (i >= amount) {
            stream.close(() => {
                console.log(">>> Data created.")
                console.timeEnd("||| Time: ")
            })
        }
    }

    writeStrings()

    stream.on("drain", () => {
        writeStrings()
    })
}

const generator = new RandomStringGenerator(4, 10, {
    withSpecialSigns: false,
    withDigits: true,
})

generator.predefinedStrings = Array(100).fill(null).map(
    (_) => (
        String(Math.round(Math.random() * 100))
    ))

createData({
	path: INPUT_PATH,
	amount: MOCK_DATA_AMOUNT,
	separator: SEPARATOR_IN,
    generator
})
