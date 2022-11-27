import './Room.css';
import React, { Component } from 'react';
import { useEffect, useState } from "react";
import { Button, TextField, Fab } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

export default function Room() {    
    const { code } = useParams(); 
    let navigate = useNavigate();     

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
        <br />
        <div class="sized">
            <select>
                <option value="">--Please choose an Stop--</option>

                {tasks.map((task) => (
                    <option value={task.Stop}>{task.Stop}</option>
                ))}
            </select>
            <section>
                <Fab size="small" className="detailButton" aria-label="edit" onClick={popUp}>
                    <EditIcon />
                </Fab>
                {isPopUp ? (
                    <div className="Popup">
                        <TextField
                            id="outlined-number"
                            type="number"
                            className="TextField"
                            label="Priority(1-7): "
                            name="Priority"
                            value={data[3].Priority}
                            onChange={(e) => handleChange(e, 3)}
                        />
                        <TextField
                            id="filled-basic"
                            className="TextField"
                            label="Arrive By(what time to arrive at stop): "
                            helperText="What time to arrive at stop by"
                            name="ArriveBy"
                            variant="filled"
                            value={data[3].ArriveBy}
                            onChange={(e) => handleChange(e, 3)}
                        />
                        <TextField
                            id="filled-basic"
                            className="TextField"
                            label="TaskName"
                            helperText="What todo"
                            name="TaskName"
                            variant="filled"
                            value={data[3].TaskName}
                            onChange={(e) => handleChange(e, 3)}
                        />
                    </div>
                ) : null}
            </section>
        </div>
        <br />
        <br />
        <div>
            <Button onClick={handleSubmit}>Leave Route</Button>
        </div>
        <br/>
        <br/>
    </div>
    )
}