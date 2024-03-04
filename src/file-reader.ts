import { parseDms } from "./coorinate-convert";
import { AirspaceLine, Runway } from "./types";
import fs from "fs";

export function readAirspace(path: string): AirspaceLine[] {
	const rawLines = fs.readFileSync(path, "utf-8").split("\n");
	const res: AirspaceLine[] = [];

	for (const rawLine of rawLines) {
		if (rawLine.startsWith(";") || !rawLine) continue;

		const split = rawLine.split(" ");
		const coordinates = split.slice(-4).map((coord) => {
			return parseDms(coord);
		});

		res.push({
			description: split.slice(0, 3).join(" "),
			start: {
				lat: coordinates[0],
				lng: coordinates[1],
			},
			end: {
				lat: coordinates[2],
				lng: coordinates[3],
			},
		});
	}

	return res;
}

export function readRunways(path: string): Runway[] {
	const rawRunways = fs.readFileSync(path, "utf-8").split("\n");
	const res: Runway[] = [];
	for (let rawRunway of rawRunways) {
		if (rawRunway.startsWith(";") || !rawRunway) continue;
		rawRunway = rawRunway.replaceAll("  ", " ");
		const split = rawRunway.split(" ");

		const coordinates = split.slice(-4).map((coord) => {
			return parseDms(coord);
		});

		res.push({
			icao: path.split("/")[path.split("/").length - 2],
			startId: split[0],
			endId: split[1],
			startHeading: parseFloat(split[2]),
			endHeading: parseFloat(split[3]),
			start: {
				lat: coordinates[0],
				lng: coordinates[1],
			},
			end: {
				lat: coordinates[2],
				lng: coordinates[3],
			},
		});
	}

	return res;
}
