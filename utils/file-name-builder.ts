import { DATA_DIR_PATH } from "../constants"

class FileNameBuilder {
    private ID: string
    dirPath: string
    constructor() {
        this.ID = crypto.randomUUID()
        this.dirPath = DATA_DIR_PATH
    }

    private getPath() {
        return `${this.dirPath}`
    }

    getName(i: number) {
        const path = this.getPath()
        return `${path}/temp-${i}-${this.ID}.txt`
    }
}

export default FileNameBuilder