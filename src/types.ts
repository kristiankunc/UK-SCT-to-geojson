export interface Coordinate {
	lat: number;
	lng: number;
}

export interface AirspaceLine {
	description: string;
	start: Coordinate;
	end: Coordinate;
}

export interface Runway {
	icao: string;
	startId: string;
	endId: string;
	startHeading: number;
	endHeading: number;
	start: Coordinate;
	end: Coordinate;
}

export interface Fix {
	id: string;
	coordinate: Coordinate;
}
