class RandomStringGenerator {
    private alphabet: string
    private digits: string
    private specialSigns: string
    private charCollection: string[]
    private predefined: string[]

	constructor(
        private minLength: number,
        private maxLength: number,
        private options?: Partial<{
            withLetters: boolean,
            withDigits: boolean,
            withSpecialSigns: boolean,
        }>
    ) {
		this.minLength = minLength
		this.maxLength = maxLength

        this.options = {
            withDigits: options?.withDigits ?? true,
            withLetters: options?.withLetters ?? true,
            withSpecialSigns: options?.withSpecialSigns ?? true
        }

        this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        this.digits = "0123456789"
        this.specialSigns = ".,/()[]{}@$#&*"

        this.charCollection = (
			(this.options.withLetters ? this.alphabet : "") +
			(this.options.withDigits ? this.digits : "") +
			(this.options.withSpecialSigns ? this.specialSigns : "")
		).split("")

        this.predefined = null
	}

	getRandomString() {
        if (this.predefined && this.predefined.length > 0) {
            return this.getPredefinedString()
        }

        const randomLength = this.getRandomLength()

        let result = ""
        for (let i = 0; i < randomLength; ++i) {
            const randomCharIndex = this.getRandomIndex(this.charCollection.length)
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

    private getPredefinedString() {
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