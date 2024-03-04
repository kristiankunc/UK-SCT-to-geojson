export function parseDms(coordStr: string): number {
	const coord = coordStr.replace(/[A-Za-z]/g, "");
	const [deg, min, sec, ms] = coord.split(".");
	const decimal = parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600 + parseFloat(ms) / 3600000;

	if (coordStr.includes("S") || coordStr.includes("W")) {
		return -decimal;
	}

	return decimal;
}
