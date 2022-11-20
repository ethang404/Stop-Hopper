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
    
    async function handleSubmit(){
        navigate('/Home')
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
        <div class="boxed">
            <strong> Sheila at: Stop #1 </strong>
        </div>
        <br />
        <div class="boxed">
            <strong> Going to: Stop #2 </strong>
        </div>
        <br /> 
        <br />
        <div class="sized">
            <select name="pets" id="pet-select">
                <option value="">--Please choose an Stop--</option>
                <option value="stop">Stop 1</option>
                <option value="stop">Stop 2</option>
                <option value="stop">Stop 3</option>
                <option value="stop">Stop 4</option>
                <option value="stop">Stop 5</option>
                <option value="stop">Stop 6</option>
                <option value="stop">Stop 7</option>

                {tasks.map((task) => (
                    <option value={task.Stop}>{task.Stop}</option>
                ))}
            </select>
            <Fab size="small" className="detailButton" aria-label="edit">
                <EditIcon />
            </Fab>
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