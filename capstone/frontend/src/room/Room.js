import "./Room.css";
import React from "react";
import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {AddStop, StopList, TaskEdit} from "../navigation/RouteMenu";
import {ShColorButton, ShColorButtonNoFullWidth, ShThemeDiv} from "../ShComponents";
import {Typography} from "@mui/material";

export default function Room() {
	const navigate = useNavigate()
	const { code } = useParams();

	const [selected, setSelected] = useState("Pick a Stop");
	const [taskInput, setTaskInput] = useState("");

	const [newStop, setNewStop] = useState({
		routeCode: code,
		stopAddress: "", //should be a address for now
	});

	const [tasks, setTasks] = useState([]);

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

		if (resp.status == "200") {
			alert("Stop Removed");
		} else {
			alert("couldnt delete stop");
		}
	}

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

	useEffect(() => {
		getTasks();
		//addTask();
		//addStop();
	}, []);

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

	return (
		<div style={{
				display: "flex",
				flexDirection: "column",
				gap: "10px", }} >
			{/* Route Code */}
			<ShThemeDiv className={"flex-container"} style={{margin: "auto", overflow: "auto", width: "100%"}}>
				<div style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-evenly",
					gap: "10px",
					margin: "10px" }}
				>
					<Typography fontWeight={"bold"} fontSize={"24pt"}>
						Route Code: {code}
					</Typography>
					<ShColorButton onClick={() => navigate("/RouteMenu/" + code)}>
						Begin Route
					</ShColorButton>
				</div>
			</ShThemeDiv>
			{/* List of Stops/Tasks */}
			<StopList
				tasks={tasks}
				setSelected={setSelected.bind(this)}
				deleteStop={deleteStop.bind(this)}
			/>
			{/* Task Edit/New Stop */}
			<div style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-evenly",
				gap: "10px",
				margin: "auto",
				overflow: "auto", }} >
				<TaskEdit
					taskInput={taskInput}
					setTaskInput={setTaskInput.bind(this)}
					selected={selected}
					addTask={addTask.bind(this)}
					style={{ flexGrow: 2, width: "100%" }}
				/>
				<AddStop
					newStop={newStop}
					setNewStop={setNewStop.bind(this)}
					addStop={addStop.bind(this)}
				/>
			</div>
		</div>
	);
}
