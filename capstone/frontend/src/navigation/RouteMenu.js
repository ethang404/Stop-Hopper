import "./RouteMenu.css";

import {
	GoogleMap,
	LoadScript,
	DirectionsRenderer,
	Marker,
	DirectionsService,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarsIcon from '@mui/icons-material/Stars';
import { Fab, Button, TextField } from "@mui/material";

export default function RouteMenu() {
	const { code } = useParams();
	let navigate = useNavigate();

	const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
	const [tasks, setTasks] = useState([]);
	const [directions, setDirections] = useState();
	const [stopOrder, setStopOrder] = useState();
	const [index, setIndex] = useState(0);

	const [isActive, setIsActive] = useState(false);
	const [selected, setSelected] = useState("Pick a Stop");
	const [taskInput, setTaskInput] = useState("");
	const [isFavorite,setFavorite] = useState(false)

	const [newTask, setNewTask] = useState({
		RouteCode: code,
		stopAddress: "Pick a Stop2",
		taskName: "",
	});
	const [newStop, setNewStop] = useState({
		routeCode: code,
		stopAddress: "", //should be a address for now
	});

	useEffect(() => {
		//anytime we move stops(click button to inc index), we display new route directions

		calculateRoute();
		console.log(stopOrder);
	}, [index]); //replace with index

	useEffect(() => {
		//call backend for array of stops in order at render time
		getTasks();
		getRoute();
	}, []);
	async function getRoute() {
		let resp = await fetch("http://127.0.0.1:8000/api/getRoute/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify({ RouteCode: code }), //make dynamic(passed from NavigateHome)
		});
		let data = await resp.json();
		setStopOrder(data);
	}
	async function getTasks() {
		let resp = await fetch("http://127.0.0.1:8000/api/getTasks/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				routeCode: code,
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
		});
		let data = await resp.json();
		console.log(data);
		setTasks(data);
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
	async function logout(){
		if(isFavorite){
			navigate("/");
		}
		else{//if user not favorited the stop-remove from databse-redirect to home after
			let resp = await fetch("http://127.0.0.1:8000/api/deleteRoute/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify({ RouteCode: "a2zXBs" }), //make dynamic(passed from NavigateHome)
		});
		console.log(resp.JSON)
			navigate("/");
		}
	}

	const center = {
		lat: 33.579166,
		lng: -101.886909,
	};

	async function addTask() {
		//make obj
		var temp = {
			RouteCode: code,
			stopAddress: selected,
			taskName: taskInput,
		};
		console.log(newTask.RouteCode);
		let resp = await fetch("http://127.0.0.1:8000/api/addTask/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify(temp),
		});
		console.log(temp);
		let data = await resp.json();
		console.log(data);
	}

	async function addStop() {
		//make obj

		console.log(newStop.routeCode);
		let resp = await fetch("http://127.0.0.1:8000/api/addStop/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify(newStop),
		});
		console.log(newStop);
		let data = await resp.json();
		console.log(data);
	}

	/*const onMapLoad = (map) => {
		navigator?.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng } }) => {
			const pos = { lat: 33.579166, lng: -101.886909 };
			setCurrentLocation({ currentLocation: pos });
		});
	};*/
	
	return (
		<div>
			<div className="mainMenu">
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
				<div>
					{tasks.map((task) => (
						<div
							key={task.id}
							onClick={(e) => {
								setSelected(task.Stop);
								setIsActive(false);
							}}
						>
							<h3>{task.Stop}</h3>
							{task.TaskInfo.map((taskInfo) => (
								<div key={taskInfo.id}>
									<div>id: {taskInfo.id}</div>
									<div>taskName: {taskInfo.taskName}</div>
									<div>stopId: {taskInfo.stopId}</div>
								</div>
							))}
						</div>
					))}
				</div>
				<section className="AddTask">
					<div class="dropdown">
						<div class="dropbtn" onClick={(e) => setIsActive(!isActive)}>
							{selected}
						</div>
						{isActive ? (
							<div class="dropdown-content">
								{tasks.map((task) => (
									<div
										onClick={(e) => {
											setIsActive(false);
											setSelected(task.Stop);
										}}
									>
										{task.Stop}
									</div>
								))}
							</div>
						) : (
							""
						)}
					</div>

					<TextField
						id="filled-basic"
						className="TaskTextField"
						label="Add a Task"
						name="taskInput"
						variant="filled"
						value={taskInput}
						onChange={(e) => setTaskInput(e.target.value)}
					/>
					<Button className="TaskButton" onClick={addTask}>
						Click here to add a task
					</Button>
				</section>

				<section className="AddStop">
					<TextField
						id="filled-basic"
						className="StopTextField"
						label="Add a Stop"
						name="newStop.stopAddress"
						variant="filled"
						value={newStop.stopAddress}
						onChange={(e) => setNewStop({ ...newStop, stopAddress: e.target.value })}
					/>
					<Button className="StopButton" onClick={addStop}>
						Click here to add a Stop to your route
					</Button>
				</section>
			</div>
			<Fab size="small" className="detailButton" aria-label="edit" onClick={() => setFavorite(true)}>
				<StarsIcon/>
			</Fab>
			{JSON.stringify(isFavorite)}
			<Button onClick={logout}>Logout</Button>
		</div>
	);
}
