
/**
 * Format integer containing bytes count
 * (for logging)
 * @date 25/07/2023 - 16:05:44
 *
 * @param {number} bytes
 * @returns {string} formatted string
 */
export const formatBytes = (bytes: number) => {
	const byteFormatter = Intl.NumberFormat("en", {
		notation: "compact",
		style: "unit",
		unit: "byte",
		unitDisplay: "narrow",
	})

    return byteFormatter.format(bytes)
}
