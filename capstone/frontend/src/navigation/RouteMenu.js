import "./Route.css";
import {
	GoogleMap,
	LoadScript,
	DirectionsRenderer,
	Marker,
	DirectionsService,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
export default function RouteMenu() {
	//loop through origin/destination/travelMode with array.map from backend on best stop to hit first
	const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
	const [markers, setMarkers] = useState({
		geocoded_waypoints: [
			{
				geocoder_status: "OK",
				partial_match: true,
				place_id: "ChIJ__8PcM4S_oYRhR1dFAKAIg4",
				types: ["establishment", "point_of_interest", "real_estate_agency"],
			},
			{
				geocoder_status: "OK",
				place_id: "ChIJR8ge8xPEQIYRSXiwt3SzLQU",
				types: ["establishment", "point_of_interest", "university"],
			},
		],
		request: {
			origin: "Park East Student living",
			destination: "Texas Tech University",
			travelMode: "DRIVING",
		},
		routes: [
			{
				bounds: {
					Fa: {
						hi: 33.588218,
						lo: -101.8564986,
					},
					ab: {
						hi: 33.5844778,
						lo: -101.8708686,
					},
				},
				copyrights: "Map data ©2022",
				legs: [
					{
						distance: {
							text: "1.1 mi",
							value: 1836,
						},
						duration: {
							text: "4 mins",
							value: 251,
						},
						end_address: "2500 Broadway, Lubbock, TX 79409, USA",
						end_location: {
							lat: 33.5845432,
							lng: -101.8708686,
						},
						start_address: "1819 Glenna Goodacre Blvd, Lubbock, TX 79401, USA",
						start_location: {
							lat: 33.588218,
							lng: -101.8575429,
						},
						steps: [
							{
								distance: {
									text: "315 ft",
									value: 96,
								},
								duration: {
									text: "1 min",
									value: 14,
								},
								end_location: {
									lat: 33.5882149,
									lng: -101.8565022,
								},
								html_instructions:
									"Head <b>east</b> on <b>Glenna Goodacre Blvd</b> toward <b>Avenue R</b>",
								polyline: {
									points: "ke_lEr`ulR?oB@_B",
								},
								start_location: {
									lat: 33.588218,
									lng: -101.8575429,
								},
								travel_mode: "DRIVING",
							},
							{
								distance: {
									text: "0.3 mi",
									value: 406,
								},
								duration: {
									text: "1 min",
									value: 79,
								},
								end_location: {
									lat: 33.5845594,
									lng: -101.8564986,
								},
								html_instructions: "Turn <b>right</b> onto <b>Avenue R</b>",
								maneuver: "turn-right",
								polyline: {
									points: "ie_lEbztlRdD@vDAdE?tD?",
								},
								start_location: {
									lat: 33.5882149,
									lng: -101.8565022,
								},
								travel_mode: "DRIVING",
							},
							{
								distance: {
									text: "0.8 mi",
									value: 1334,
								},
								duration: {
									text: "3 mins",
									value: 158,
								},
								end_location: {
									lat: 33.5845432,
									lng: -101.8708686,
								},
								html_instructions:
									'Turn <b>right</b> onto <b>Broadway St</b><div style="font-size:0.9em">Destination will be on the right</div>',
								maneuver: "turn-right",
								polyline: {
									points:
										"on~kEbztlR@`BHRAvB?pB@vB?~D?jL@`F?xC?l@?~E?jE?h@?d@?vB?d@?r@?dB?b@?~C@tD?l@?XKX?Z?^",
								},
								start_location: {
									lat: 33.5845594,
									lng: -101.8564986,
								},
								travel_mode: "DRIVING",
							},
						],
						traffic_speed_entry: [],
						via_waypoint: [],
					},
				],
				overview_polyline: {
					points: "ke_lEr`ulR@oE|I?zJ?@`BHRAhF@vH@tY?rX@fL?XKX?z@",
				},
				summary: "Broadway St",
				warnings: [],
				waypoint_order: [],
			},
		],
		status: "OK",
	});
	//sample data of 'routes' that I expect to be returned from backend
	let [directions, setDirections] = useState();
	let [stopOrder, setStopOrder] = useState();

	async function calculateRoute() {
		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService();
		console.log("this is my testin calculate route calls");
		//const results = await directionsService.route(arr[0]);
		//console.log(results);
		//console.log(markers);
		//setDirections(results);

		//make call to backend to retrieve order of stops. [{orgin:stop1,destination;stop2}, {origin:stop2, destiation: stop3}]
		const results = await directionsService.route({
			origin: "Park East Student living",
			destination: "Texas Tech University",
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		});
		console.log(results);
		console.log(markers);

		if (results.status == "OK") {
			console.log("everything is good");
			//alert("Task Successfully Added!");
			setDirections(results);
		} else {
			console.log("Something went wrong");
			console.log("error");
		}
		console.log(markers);
		/*setMarkers((markers) => ({
			...markers,
			request: {
				origin: "Park East Student living",
				destination: "Texas Tech University",
				// eslint-disable-next-line no-undef
				travelMode: google.maps.TravelMode.DRIVING,
			},
		}));*/
		/*const results = await directionsService.route({
			origin: "Park East Student living",
			destination: "Texas Tech University",
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		});
		console.log(results);
		console.log(markers);
		if (results.status == "OK") {
			console.log("everything is good");
			//alert("Task Successfully Added!");
			setDirections(results);
		} else {
			console.log("Something went wrong");
			console.log("error");
		}
		console.log(markers);*/
	}

	const center = {
		lat: 33.579166,
		lng: -101.886909,
	};
	function directionsCallback(response) {
		console.log(response);

		if (response !== null) {
			if (response.status === "OK") {
				setDirections(response);
			} else {
				console.log("response: ", response);
			}
		}

		//console.log("my value: " + JSON.stringify(directions));
	}
	/*const onMapLoad = (map) => {
		navigator?.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng } }) => {
			const pos = { lat: 33.579166, lng: -101.886909 };
			setCurrentLocation({ currentLocation: pos });
		});
	};*/
	return (
		<div>
			{JSON.stringify(markers)}
			<LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
				<GoogleMap
					center={center}
					zoom={13}
					//onLoad={(map) => onMapLoad(map)}
					mapContainerStyle={{ height: "400px", width: "800px" }}
					onLoad={calculateRoute}
				>
					{markers && <DirectionsRenderer directions={markers} />}
				</GoogleMap>
			</LoadScript>
			{JSON.stringify(process.env.GOOGLE_MAPS_API_KEY)}
		</div>
	);
}
