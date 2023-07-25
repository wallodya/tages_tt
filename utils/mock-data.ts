import fs from "fs"
import { INPUT_PATH, SEPARATOR_IN } from "../constants"
import checkDirectory from "./check-dir"
import RandomStringGenerator, { RandomStringGeneratorOptions } from "./random"

type MockDataCreatorOptions = Partial<{
	outputPath: string
	minLength: number
	maxLength: number
	separator: string
	predefinedStrings: string[]
}> &
	RandomStringGeneratorOptions

/**
 * Class for creating mock data with variable options.
 * Data can be returned as a string, array of strings
 * or saved to a file.
 * @date 25/07/2023 - 16:07:10
 *
 * @param {MockDataCreatorOptions} options
 * @param {string} options.outputPath Path where file with mock data will be saved.
 * @param {string} options.separator Character to separate generated strings with.
 * @param {number} options.minLength Minimal length of generated srtings.
 * @param {number} options.maxLength Maximal length of generated strings.
 * @param {string[]} options.predefinedStrings When provided, generator will fill mock data
 * with these strings instead of generating random ones.
 * @param {boolean} withLetters Whether to use letters (latin) when genearting strings
 * @param {boolean} withDigits Whether to use digits (0-9) when generating strings
 * @param {boolean} withSpecialSigns Whether to use special signs (.,;:/()[]{}@$#&*<>\"'%`~) when generating strings
 * 
 * @class MockDataCreator
 * @type {MockDataCreator}
 */
class MockDataCreator {
	stringGenerator: RandomStringGenerator
	private writeHandle: fs.WriteStream
	stringsAmount: number
	stringsGenerated: number
	separator: string
	outputPath: string

	/**
	 * Creates an instance of MockDataCreator.
	 * @date 25/07/2023 - 16:10:04
	 *

     * 
	 */
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

	/**
	 * Create file with mock data.
	 * Configure generated strings by providing options parameter to the constructor.
	 * @date 25/07/2023 - 17:49:09
	 *
	 * @async
	 * @param {number} amount Amount of strings to generate
	 */
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

	/**
	 * Create and return array with randomly generated strings.
	 * Configure generated strings by providing options parameter to the constructor.
	 * @date 25/07/2023 - 17:50:22
	 *
	 * @param {number} amount Amount of strings to generate (between 1 and 10_000).
	 * @returns {string[]}
	 */
	createArray(amount: number): string[] {
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
		return Array(amount)
			.fill(null)
			.map(_ => this.stringGenerator.getRandomString())
	}

	/**
	 * Create and return randomly generated strings joined with separator.
	 * Configure generated strings by providing options parameter to the constructor.
	 * @date 25/07/2023 - 17:50:22
	 *
	 * @param {number} amount Amount of strings to generate (between 1 and 10_000).
	 * @returns {string}
	 */
	createDataString(amount: number): string {
		return this.createArray(amount).join(this.separator)
	}

	/**
	 * Create and return randomly generated strings joined with separator and sliced into chunks.
	 * Configure generated strings by providing options parameter to the constructor.
	 * @date 25/07/2023 - 17:50:22
	 *
	 * @param {number} dataAmount Amount of strings to generate (between 1 and 10_000).
	 * @param {number} chunksAmount Amount of chunks.
	 * @returns {{chunks: string[], data: string, splitIndexes: number[]}}
	 * Chunks as array of strings, unsliced data and array with indexes where data was sliced.
	 */
	createDataChunks(
		dataAmount: number,
		chunksAmount: number
	): { chunks: string[]; data: string; splitIndexes: number[] } {
		const data = this.createDataString(dataAmount)

		const splitIndexes = [
			0,
			...Array(chunksAmount - 1)
				.fill(null)
				.map((_, i) => Math.ceil(i * (data.length / chunksAmount))),
		]

		const chunks = []

		for (let i = 1; i < splitIndexes.length; ++i) {
			chunks.push(data.slice(splitIndexes[i - 1], splitIndexes[i]))
		}

		chunks.push(data.slice(splitIndexes.at(-1)))

		return {
			chunks,
			data,
			splitIndexes,
		}
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

export default MockDataCreator
