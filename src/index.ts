import fs from "fs";
import { AirspaceLine, Fix, Runway } from "./types";
import { parseDms } from "./coorinate-convert";
import { readAirspace, readRunways } from "./file-reader";

const sct = "./UK-Sector-File";

const airports = fs.readdirSync(`${sct}/Airports`);
for (const icao of airports) {
	let airspaceLines: AirspaceLine[] = [];
	let runways: Runway[] = [];

	const basePath = `${sct}/Airports/${icao}`;

	const airspacePath = `${basePath}/Airspace.txt`;
	const runwayPath = `${basePath}/Runway.txt`;

	if (fs.existsSync(airspacePath)) airspaceLines = airspaceLines.concat(readAirspace(airspacePath));

	if (fs.existsSync(runwayPath)) runways = runways.concat(readRunways(runwayPath));

	const geojson: GeoJSON.FeatureCollection = {
		type: "FeatureCollection",
		features: [],
	};

	for (const line of airspaceLines) {
		geojson.features.push({
			type: "Feature",
			properties: {
				description: line.description,
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[line.start.lng, line.start.lat],
					[line.end.lng, line.end.lat],
				],
			},
		});
	}

	for (const runway of runways) {
		geojson.features.push({
			type: "Feature",
			properties: {
				description: `${runway.icao} - ${runway.startId} / ${runway.endId}`,
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[runway.start.lng, runway.start.lat],
					[runway.end.lng, runway.end.lat],
				],
			},
		});
		geojson.features.push({
			type: "Feature",
			properties: {
				description: runway.startId,
			},
			geometry: {
				type: "Point",
				coordinates: [runway.start.lng, runway.start.lat],
			},
		});
		geojson.features.push({
			type: "Feature",
			properties: {
				description: runway.endId,
			},
			geometry: {
				type: "Point",
				coordinates: [runway.end.lng, runway.end.lat],
			},
		});
	}

	fs.writeFileSync(`out/${icao}.json`, JSON.stringify(geojson));
}

const waypoints: Fix[] = [];
const rawFixes = fs.readFileSync(`${sct}/Navaids/FIXES_UK.txt`, "utf-8").split("\n");
for (const rawFix of rawFixes) {
	if (rawFix.startsWith(";") || !rawFix) continue;
	const split = rawFix.split(" ");
	const coordinate = split.slice(1, 3).map((coord) => {
		return parseDms(coord);
	});

	waypoints.push({
		id: split[0],
		coordinate: {
			lat: coordinate[0],
			lng: coordinate[1],
		},
	});
}

const rawVors = fs.readFileSync(`${sct}/Navaids/VOR_UK.txt`, "utf-8").split("\n");
for (const rawVor of rawVors) {
	if (rawVor.startsWith(";") || !rawVor) continue;
	const split = rawVor.split(" ");
	const coordinate = split.slice(2, 4).map((coord) => {
		return parseDms(coord);
	});

	waypoints.push({
		id: split[0],
		coordinate: {
			lat: coordinate[0],
			lng: coordinate[1],
		},
	});
}

// convert the data to geojson
const geojson: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: [],
};

for (const fix of waypoints) {
	geojson.features.push({
		type: "Feature",
		properties: {
			description: fix.id,
		},
		geometry: {
			type: "Point",
			coordinates: [fix.coordinate.lng, fix.coordinate.lat],
		},
	});
}

fs.writeFileSync("out/waypoints.json", JSON.stringify(geojson));
