import { MOCK_DATA_AMOUNT, SEPARATOR_IN } from "./constants"
import MockDataCreator from "./utils/mock-data"

if (process.env["TEST"] !== "true") {
    const dataCreator = new MockDataCreator({
        minLength: 2,
        maxLength: 20,
        separator: SEPARATOR_IN
    })
    
    dataCreator.createFile(MOCK_DATA_AMOUNT)
}
