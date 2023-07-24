import fs from "fs"
import checkDirectory from "./utils/check-dir"
import RandomStringGenerator, { RandomStringGeneratorOptions } from "./utils/random"
import { INPUT_PATH, MOCK_DATA_AMOUNT, SEPARATOR_IN } from "./constants"

type MockDataCreatorOptions = Partial<{
    outputPath: string,
    minLength: number,
    maxLength: number,
    separator: string,
    predefinedStrings: string[]
}> & RandomStringGeneratorOptions

class MockDataCreator {
	stringGenerator: RandomStringGenerator
	private writeHandle: fs.WriteStream
	stringsAmount: number
	stringsGenerated: number
	separator: string
	outputPath: string

	constructor({
		outputPath,
        separator,
		minLength,
		maxLength,
        predefinedStrings,
		...generatorOptions
	}: MockDataCreatorOptions) {
		this.outputPath = outputPath ?? INPUT_PATH
        this.separator = separator ?? SEPARATOR_IN

		this.stringGenerator = new RandomStringGenerator(
			minLength ?? 1,
			maxLength ?? 10,
			{ ...generatorOptions, separator }
		)
        this.stringGenerator.predefinedStrings = predefinedStrings ?? []

		this.stringsGenerated = 0
	}

	async createFile(amount: number) {
		console.log(`>>> Creating test data at "${this.outputPath}"...`)
		console.time("||| Time: ")

		await checkDirectory(this.outputPath)

		this.stringsAmount = amount
		this.writeHandle = fs.createWriteStream(this.outputPath)

		this.writeStrings()

		this.writeHandle.on("drain", () => {
			this.writeStrings()
		})
	}

	createArray(amount: number) {
        if (amount <= 0) {
            throw new Error(`
                Invalid "amount" argument for createArray: ${amount}
                Mock data amount should be at least 1.  
            `)
        }
        if (amount > 1e4) {            
            throw new Error(`
                Invalid "amount" argument for createArray: ${amount}
                Amount is too big. Make sure to use amount below 10_000 or use "createFile" method instead
            `)
        }
        return Array(amount).fill(null).map(_ => this.stringGenerator.getRandomString())
    }

	private writeStrings() {
		while (this.stringsGenerated < this.stringsAmount) {
			const randomString = this.stringGenerator.getRandomString()
			const buffer = Buffer.from(randomString + this.separator, "utf-8")

			if (!this.writeHandle.write(buffer)) {
				break
			}

			++this.stringsGenerated
		}
		if (this.stringsGenerated >= this.stringsAmount) {
			this.writeHandle.close(() => {
				console.log(">>> Data created.")
				console.timeEnd("||| Time: ")
			})
		}
	}
}

const dataCreator = new MockDataCreator({
    minLength: 4,
    maxLength: 5,
    withLetters: false,
    separator: ","
})

dataCreator.createFile(MOCK_DATA_AMOUNT)

export default MockDataCreator
