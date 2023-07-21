import { SEPARATOR } from "../constants"

export const processChunk = (
	chunk: Buffer,
	previousTail: string
): [string[], string] => {
	let chunkString = chunk.toString()

	if (previousTail.length) {
		chunkString = previousTail + chunkString
	}

	const strings = chunkString.split(SEPARATOR)
  
	let currentTail = strings.pop()

	return [strings, currentTail]
}

export const sortChunk = (strings: string[]) => {
    strings.sort()

    return strings
}
