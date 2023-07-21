import { INPUT_PATH } from "../constants"

export class InputError extends Error {
    message: string
    constructor() {
        super()
        this.message = `
        Input file does not exits at "${INPUT_PATH}".
        You need to do one of the following:
            - Run "npm run create" command to randomly generate mock data
            - If you use your own input file,
            make sure its name and path match with corresponding variables in "constants.ts" file
        `
    }
}