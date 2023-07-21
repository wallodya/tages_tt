import { formatBytes } from "./format"

const withStats = (fn: (...args: any[]) => any | Promise<any>, ...args: any[]) => {

    let finished = false
    let peakRSS = 0

    const updatePeakRSS = () => {
        
        const currentRSS = process.memoryUsage.rss()
        
        if (currentRSS > peakRSS) {
            peakRSS = currentRSS
        }

        if (finished) {
            console.log("||| Peak memory usage: ", formatBytes(peakRSS))
            return
        }

        setTimeout(updatePeakRSS, 200)
    }
    
    return async () => {
        console.time("||| Time: ")
        updatePeakRSS()
        await fn(...args)
        finished = true
        console.timeEnd("||| Time: ")
    }
}

export default withStats