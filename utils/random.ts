import { SEPARATOR_IN } from "../constants"

export type RandomStringGeneratorOptions = Partial<{
	withLetters: boolean
	withDigits: boolean
	withSpecialSigns: boolean
    separator: string
}>


/**
 * Class for generating random strings.
 * Generated string can be configured by providing options to a constructor
 * or by using "generatorOptions" setter
 * 
 * @date 25/07/2023 - 18:19:31
 *
 * @param {number} minLength Minimal length of generated srtings.
 * @param {number} maxLength Maximal length of generated strings.
 * @param {RandomStringGeneratorOptions} options Generator options
 * @param {boolean} options.withLetters Whether to use letters (latin) when genearting strings
 * @param {boolean} options.withDigits Whether to use digits (0-9) when generating strings
 * @param {boolean} options.withSpecialSigns Whether to use special signs (.,;:/()[]{}@$#&*<>\"'%`~) when generating strings.
 * @param {string} options.separator Character to separate generated strings with.
 * 
 * @class RandomStringGenerator
 * @type {RandomStringGenerator}
 */
class RandomStringGenerator {
	private alphabet: string
	private digits: string
	private specialSigns: string
	private charCollection: string[]
	private predefined: string[]

	constructor(
		public minLength: number,
		public maxLength: number,
		private options?: RandomStringGeneratorOptions
	) {
		this.minLength = minLength
		this.maxLength = maxLength

		this.options = {
			withDigits: options?.withDigits ?? true,
			withLetters: options?.withLetters ?? true,
			withSpecialSigns: options?.withSpecialSigns ?? true,
            separator: options?.separator ?? SEPARATOR_IN
		}

		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
		this.digits = "0123456789"
		this.specialSigns = ".,;:/()[]{}@$#&*<>\"'%`~"

		this.charCollection = (
			(this.options.withLetters ? this.alphabet : "") +
			(this.options.withDigits ? this.digits : "") +
			(this.options.withSpecialSigns ? this.specialSigns : "")
		)
			.split("")
			.filter(char => char !== this.options.separator)

		this.predefined = null
	}

    
	/**
     * Generate random string (with options configured options).
     * If predefined strings were specified one of those will be returned
     * @date 25/07/2023 - 18:24:05
     *
     * @returns {string} Random string
     */
    getRandomString(): string {
		if (this.predefined && this.predefined.length > 0) {
			return this.getPredefinedString()
		}

		const randomLength = this.getRandomLength()

		let result = ""
		for (let i = 0; i < randomLength; ++i) {
			const randomCharIndex = this.getRandomIndex(
				this.charCollection.length
			)
			result += this.charCollection[randomCharIndex]
		}

		return result
	}

	getRandomNumericString() {
		const randomLength = this.getRandomLength()

		let result = ""
		for (let i = 0; i < randomLength; ++i) {
			const randomDigitIndex = this.getRandomIndex(this.digits.length)
			result += this.digits[randomDigitIndex]
		}

		return result
	}

	set predefinedStrings(arr: string[]) {
		this.predefined = [...arr]
		return
	}

    set generatorOptions(options: RandomStringGeneratorOptions) {
        this.options = {
			withDigits: options?.withDigits ?? this.options.withDigits,
			withLetters: options?.withLetters ?? this.options.withLetters,
			withSpecialSigns: options?.withSpecialSigns ?? this.options.withSpecialSigns,
            separator: options?.separator ?? this.options.separator
		}
        
        this.charCollection = (
			(this.options.withLetters ? this.alphabet : "") +
			(this.options.withDigits ? this.digits : "") +
			(this.options.withSpecialSigns ? this.specialSigns : "")
		)
			.split("")
			.filter(char => char !== this.options.separator)

        return
    }

    
	/**
     * Get random string from list of predifined srtings
     * @date 25/07/2023 - 18:22:59
     *
     * @private
     * @returns {string} Random string from predefined list
     */
    private getPredefinedString(): string {
		if (!this.predefined) {
			throw new Error("No strings were predefined")
		}

		const randomIndex = this.getRandomIndex(this.predefined.length)

		return this.predefined[randomIndex]
	}

	private getRandomIndex(length: number) {
		return Math.round(Math.random() * (length - 1))
	}

	private getRandomLength() {
		return Math.round(
			this.minLength + Math.random() * (this.maxLength - this.minLength)
		)
	}
}

export default RandomStringGenerator
