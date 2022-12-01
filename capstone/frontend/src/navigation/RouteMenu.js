import "./RouteMenu.css";

import {
	GoogleMap,
	LoadScript,
	DirectionsRenderer,
	Marker,
	DirectionsService,
} from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarsIcon from "@mui/icons-material/Stars";
import DeleteIcon from '@mui/icons-material/Delete';
import {Fab, Button, TextField, IconButton, Typography} from "@mui/material";
import {ShColorButton, ShTextField, ShThemeDiv} from "../ShComponents";

/**
 * Basic list widget which lists stops and a delete button to the side.
 *
 * @param props Props to apply to the top level element
 * @param props.tasks the list of stops to render
 * @param props.setSelected the method to call when a stop name is clicked
 * @param props.deleteStop the method to call when the delete icon is clicked
 * @returns {JSX.Element}
 */
function StopList(props) {
	const childProps = {...props}
	delete childProps.tasks
	delete childProps.setSelected
	delete childProps.deleteStop

	return <ShThemeDiv
			{...props}
			className={"flex-container"}
			style={{ margin: "auto", overflow: "auto", width: "100%"}}
		>
		<div style={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-evenly",
			gap: "10px",
			margin: "10px",
			overflow: "auto", }}
		>
			{props.tasks.map((task) => (
				<ShThemeDiv style={{ backgroundColor: "#fc7676" }} >
					<div
						key={task.id}
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-evenly",
							gap: "10px",
							margin: "10px" }}
					>
						<div style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center"}}
							onClick={(e) => { props.setSelected(task.Stop) }}
						>
							<Typography style={{ marginLeft: "5px" }} fontWeight={"bold"} >
								{task.Stop}
							</Typography>
							<IconButton aria-label="delete" onClick={() => { props.deleteStop(task.Stop) }} >
								<DeleteIcon />
							</IconButton>
						</div>
						{ task.TaskInfo.length > 0 &&
							<div>
							{
							task.TaskInfo.map((taskInfo) => (
								<Typography style={{ textAlign: "left" }}>
									{taskInfo.taskName}
								</Typography>
							))
							}
							</div>
						}
					</div>
				</ShThemeDiv>
			))}
		</div>
	</ShThemeDiv>
}

/**
 * Simple widget to create a new task for the selected stop
 *
 * @param props props to add to the top level component
 * @param props.taskInput the value of the task input box
 * @param props.setTaskInput the method to call when updating the task input
 * @param props.selected the name of the selected stop
 * @param props.addTask the method to call when the add task button is clicked
 * @returns {JSX.Element}
 * @constructor
 */
function TaskEdit(props) {
	const childProps = {...props}
	delete childProps.taskInput
	delete childProps.setTaskInput
	delete childProps.selected
	delete childProps.addTask

	return <ShThemeDiv {...childProps} className={"flex-container"} style={{ margin: "auto", overflow: "auto", width: "100%", }} >
		<form onSubmit={props.addTask}>
			<div style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-evenly",
				gap: "10px",
				margin: "10px",
				overflow: "auto", }}
			>
				<Typography>
					{props.selected}
				</Typography>
				<ShTextField
					label="Task"
					value={props.taskInput}
					onChange={(e) => props.setTaskInput(e.target.value)}
				/>
				<ShColorButton onClick={props.addTask} disabled={props.taskInput.trim() === ""}>
					Add Task
				</ShColorButton>
			</div>
		</form>
	</ShThemeDiv>
}

export default function RouteMenu() {
	const routePolyline = useRef();
	const { code } = useParams();
	let navigate = useNavigate();

	const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
	const [tasks, setTasks] = useState([]);
	const [directions, setDirections] = useState();
	const [stopOrder, setStopOrder] = useState();
	const [index, setIndex] = useState(0);

	const [isActive, setIsActive] = useState(false);
	const [selected, setSelected] = useState("Click a Stop Name to Add a Task");
	const [taskInput, setTaskInput] = useState("");
	const [isFavorite, setFavorite] = useState(false);

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
		let resp = await fetch("http://127.0.0.1:8000/api/calculateRoute/", {
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
		if (directions) {
			setDirections(null);
			console.log(directions);
		}
		console.log(stopOrder.length);
		console.log(index);
		console.log(stopOrder[index]);
		console.log(directions);
		if (index >= stopOrder.length) {
			alert("Finished Route");
		}
		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService();

		console.log("this is my testin calculate route calls");
		console.log(directions);
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
	async function logout() {
		// Delete cookies used for login
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");

		if (isFavorite) {
			navigate("/");
		} else {
			//if user not favorited the stop-remove from databse-redirect to home after
			let resp = await fetch("http://127.0.0.1:8000/api/deleteRoute/", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
				},
				body: JSON.stringify({ RouteCode: code }), //make dynamic(passed from NavigateHome)
			});
			console.log(resp.JSON);
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

	async function deleteTask(taskId) {
		let resp = await fetch("http://127.0.0.1:8000/api/deleteTask/", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify({ id: taskId }),
		});

		if (resp.status == "200") {
			alert("task completed");
		} else {
			alert("couldnt delete task");
		}
	}
	async function deleteStop(stopName) {
		let resp = await fetch("http://127.0.0.1:8000/api/deleteStop/", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify({
				routeCode: code,
				stopName: stopName,
			}),
		});

		if (resp.ok) {
			alert("Stop Removed");
		} else {
			alert("couldnt delete stop");
		}
	}

	async function addStop() {
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
		<div style={{
				display: "flex",
				flexDirection: "column",
				gap: "10px", }} >
			<ShThemeDiv
				style={{
					margin: "auto",
					overflow: "auto", }}
				className={"flex-container"} >
				<div style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-evenly",
					gap: "10px",
					margin: "10px"
				}}>
					{/* Need extra div here as something with LoadScript/Map adds an extra div messing up spacing */}
					<div>
						<LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
							<GoogleMap
								center={center}
								zoom={13}
								//onLoad={(map) => onMapLoad(map)}
								mapContainerStyle={{ height: "640px", width: "520px" }}
								onLoad={calculateRoute}
							>
								{directions && <DirectionsRenderer directions={directions} />}
							</GoogleMap>
						</LoadScript>
					</div>
					<ShColorButton
						onClick={() => setIndex(index + 1)}
					>
						Debug: Next Stop
					</ShColorButton>
				</div>
			</ShThemeDiv>
			<StopList
				tasks={tasks}
				setSelected={setSelected.bind(this)}
				deleteStop={deleteStop.bind(this)}
			/>
			<TaskEdit
				taskInput={taskInput}
				setTaskInput={setTaskInput.bind(this)}
				selected={selected}
				addTask={addTask.bind(this)}
			/>

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
			<Fab
				size="small"
				className="detailButton"
				aria-label="edit"
				onClick={() => setFavorite(true)}
			>
				<StarsIcon />
			</Fab>
			{JSON.stringify(isFavorite)}
			<Button onClick={logout}>Logout</Button>
		</div>
	);
}
