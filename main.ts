import sortData from "./sorting"
import withStats from "./utils/stats"

const main = async () => {
    await sortData()
}

if (process.env["DEBUG"] === "true") {
    withStats(main)()
} else {
    main()
}
