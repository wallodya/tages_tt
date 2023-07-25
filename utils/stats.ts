import { formatBytes } from "./format"


/**
 * Adds benchmarking functionality to a functions
 * Currently only mesaures peak RSS and time a function was running
 * @date 25/07/2023 - 18:12:21
 *
 * @param fn Function to wrap
 * @returns Wrapped function
 */
const withStats = (fn: (...args: any[]) => any | Promise<any>) => {

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
        return
    }
    
    return async (...args: any[]) => {
        console.time("||| Time: ")
        updatePeakRSS()
        await fn(...args)
        finished = true
        console.timeEnd("||| Time: ")
    }
}

export default withStats