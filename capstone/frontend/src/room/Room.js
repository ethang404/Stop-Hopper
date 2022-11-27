import './Room.css';
import React, { Component } from 'react';
import { useEffect, useState } from "react";
import { Button, TextField, Fab } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

export default function Room() {    
    const { code } = useParams(); 
    let navigate = useNavigate();     

    const [selected, setSelected] = useState("Pick a Stop");
    const [isActive, setIsActive] = useState(false);
    const [taskInput, setTaskInput] = useState("");

    const [newStop, setNewStop] = useState({
		routeCode: code,
		stopAddress: "", //should be a address for now
	});
    const [newTask, setNewTask] = useState({
		RouteCode: code,
		stopAddress: "Pick a Stop2",
		taskName: "",
	});

    const [detail, setDetail] = useState({ driver: "", viewer: ""});
    const [authTokens, setAuthTokens] = useState([]);
    const [isPopUp, setPopUp] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [stops, setStops] = useState([]); 
    const [data, setData] = useState([
		{
			Stop: "",
			Priority: null,
			ArriveBy: "",
			TaskName: "",
		},
		{
			Stop: "",
			Priority: null,
			ArriveBy: "",
			TaskName: "",
		},
		{
			Stop: "",
			Priority: null,
			ArriveBy: "",
			TaskName: "",
		},
		{
			Stop: "",
			Priority: null,
			ArriveBy: "",
			TaskName: "",
		},
		{
			Stop: "",
			Priority: null,
			ArriveBy: "",
			TaskName: "",
		},
		{
			Stop: "",
			Priority: null,
			ArriveBy: "",
			TaskName: "",
		},
		{
			Stop: "",
			Priority: null,
			ArriveBy: "",
			TaskName: "",
		},
	]);
    
    async function handleSubmit(){
        navigate('/Home')
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

    function popUp(e) {
		if (isPopUp) {
			setPopUp(false);
			console.log(isPopUp);
		} else {
			setPopUp(true);
			console.log(isPopUp);
		}
	}

    useEffect(() => {
        getTasks();
        //addTask();
        //addStop();
    }, [] )

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

	function handleChange(e, index) {
		console.log("index: " + index);
		console.log("property name: " + e.target.name);
		let newArr = [...data]; // copying the old datas array
		// a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
		if (e.target.name === "Stop") {
			newArr[index].Stop = e.target.value;
		} else if (e.target.name === "Priority") {
			newArr[index].Priority = e.target.value;
		} else if (e.target.name === "ArriveBy") {
			newArr[index].ArriveBy = e.target.value;
		} else if (e.target.name === "TaskName") {
			newArr[index].TaskName = e.target.value;
		}
		setData(newArr);
	}

    return (
    <div>
        <div class="sized">
            <h1> Routing Room </h1>
        </div>
        <br />
        <div class="sized" border="black">
            Route Code: {code}
        </div>
        <br />
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
                        <div key={taskInfo.id} onClick={() => deleteTask(taskInfo.id)}>
                            <div>id: {taskInfo.id}</div>
                            <div>taskName: {taskInfo.taskName}</div>
                            <div>stopId: {taskInfo.stopId}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
        <section className="AddTask">
            <div className="dropdown">
                <div className="dropbtn" onClick={(e) => setIsActive(!isActive)}>
                    {selected}
                </div>
                {isActive ? (
                    <div className="dropdown-content">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
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
        <br />
        <div>
            <Button onClick={handleSubmit}>Leave Route</Button>
        </div>
        <br/>
        <br/>
    </div>
    )
}