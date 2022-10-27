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
	const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

	const [directions, setDirections] = useState();
	const [stopOrder, setStopOrder] = useState();
	const [index, setIndex] = useState(0);

	useEffect(() => {
		//anytime we move stops(click button to inc index), we display new route directions
		calculateRoute();
		console.log(stopOrder);
	}, [index]); //replace with index

	useEffect(() => {
		//call backend for array of stops in order at render time
		getRoute();
	}, []);
	async function getRoute() {
		let resp = await fetch("http://127.0.0.1:8000/api/getRoute/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify({ RouteCode: "a2zXBs" }), //make dynamic(passed from NavigateHome)
		});
		let data = await resp.json();
		setStopOrder(data);
	}
	async function calculateRoute() {
		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService();
		console.log("this is my testin calculate route calls");

		//console.log(data);
		//console.log(stopOrder);

		const routing = await directionsService.route(stopOrder[index]);
		//make call to backend to retrieve order of stops. [{orgin:stop1,destination;stop2}, {origin:stop2, destiation: stop3}]
		if (routing.status == "OK") {
			console.log("routing started");
			setDirections(routing);
		} else {
			console.log("Something went wrong");
			console.log("error");
		}
	}

	const center = {
		lat: 33.579166,
		lng: -101.886909,
	};

	/*const onMapLoad = (map) => {
		navigator?.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng } }) => {
			const pos = { lat: 33.579166, lng: -101.886909 };
			setCurrentLocation({ currentLocation: pos });
		});
	};*/
	return (
		<div>
			<LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
				<GoogleMap
					center={center}
					zoom={13}
					//onLoad={(map) => onMapLoad(map)}
					mapContainerStyle={{ height: "400px", width: "800px" }}
					onLoad={calculateRoute}
				>
					{directions && <DirectionsRenderer directions={directions} />}
				</GoogleMap>
			</LoadScript>
			<button onClick={() => setIndex(index + 1)}>Click to next Stop</button>
		</div>
	);
}
