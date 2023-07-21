import fs from "fs"
import { mkdir } from "fs/promises"
import RandomStringGenerator from "./utils/random"
import { INPUT_PATH, MOCK_DATA_AMOUNT, SEPARATOR } from "./constants"

const createOutputDirectory = async (path: string) => {
    const outDirPath = path.split("/").slice(0, -1).join("/")
    
    if (fs.existsSync(outDirPath)) {
        console.log("> Path exists")
        return
    }
    
    console.log("> Path does not exists")
    
    console.log(`> Creating out directory <${outDirPath}>...`)
    await mkdir(outDirPath)
    
    console.log("> Directory created")
    return
}

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
	console.time("create-data")

	await createOutputDirectory(path)

	const file = fs.createWriteStream(path)

	for (let i = 0; i < amount; ++i) {
		const randomString = generator.getRandomString()
		file.write(randomString + separator)
	}

	file.end()

	console.timeEnd("create-data")
	console.log(">>> Data created.")
	return
}

const generator = new RandomStringGenerator(4, 10, {
    withSpecialSigns: false,
    withDigits: true,
})

generator.predefinedStrings = Array(20).fill(null).map((_, i) => String(i))

createData({
	path: INPUT_PATH,
	amount: MOCK_DATA_AMOUNT,
	separator: SEPARATOR,
    generator
})
