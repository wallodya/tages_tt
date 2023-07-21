export const formatBytes = (bytes: number) => {
	const byteFormatter = Intl.NumberFormat("en", {
		notation: "compact",
		style: "unit",
		unit: "byte",
		unitDisplay: "narrow",
	})

    return byteFormatter.format(bytes)
}
