import fs from "fs"
import { mkdir } from "fs/promises"

const checkDirectory = async (path: string) => {
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

export default checkDirectory