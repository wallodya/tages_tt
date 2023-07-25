export const DATA_DIR_PATH = "./data"
export const INPUT_FILE_NAME = "input.txt"
export const OUTPUT_FILE_NAME = "output.txt"
export const TEST_RESULT_FILE_NAME = "test-result.txt"

export const INPUT_PATH = `${DATA_DIR_PATH}/${INPUT_FILE_NAME}`
export const OUTPUT_PATH = `${DATA_DIR_PATH}/${OUTPUT_FILE_NAME}`
export const TEST_RESULT_PATH = `${DATA_DIR_PATH}/${TEST_RESULT_FILE_NAME}`

export const MOCK_DATA_AMOUNT = 1e7

// Making sure separator is always 'space' in testing environment
// Otherwise will have to insert this variable in every test string/chunk
// or change it before running tests
export const SEPARATOR_TEST = " "
export const SEPARATOR_IN = process.env["TEST"] === "true" ? SEPARATOR_TEST : "\n"
export const SEPARATOR_OUT = process.env["TEST"] === "true" ? SEPARATOR_TEST : "\n"