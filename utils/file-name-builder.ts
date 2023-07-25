import { DATA_DIR_PATH } from "../constants"


/**
 * Class for creating unique names (with path) for temp files
 * in the following format:
 * "tmp-index-unique ID".
 * Use this class for managing temp files while sorting and merging chunks
 * @date 25/07/2023 - 15:57:11
 *
 * @class FileNameBuilder
 * @type {FileNameBuilder}
 */
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
    
    /**
     * After initializing class use this to get name of the file 
     * by providing its index
     * Index of the file is basically index of the chunk 
     * for which temp file was created
     * @date 25/07/2023 - 15:59:31
     *
     * @param {number} i index of the file (chunk)
     * @returns {string} name (with path) of the temp file
     */
    getName(i: number): string {
        const path = this.getPath()
        return `${path}/temp-${i}-${this.ID}.txt`
    }
}

export default FileNameBuilder