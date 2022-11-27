import './Room.css';
import React, { Component } from 'react';
import { useEffect, useState } from "react";
import { Button, TextField, Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Room() {    
    let navigate = useNavigate(); 
    const [detail, setDetail] = useState({ driver: "", viewer: ""});
    const [authTokens, setAuthTokens] = useState([]);
    async function handleSubmit() {
        let response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(detail),
        });
        let data = await response.json();

        console.log(data.access);
        console.log(data.refresh);
        if (response.status === 200) {
            setAuthTokens(data);
            localStorage.setItem("accessToken", JSON.stringify(data.access));
            localStorage.setItem("refreshToken", JSON.stringify(data.refresh));
            navigate("/Home");
        } else {
            alert("Error with Credentials!");
        }
    }
    return (
    <>
        <div class="sized">
            <h1> Routing Room</h1>
        </div>
        <br />
        <div class="sized" border="black">
            <body>
            Route Code: 123455
            </body>
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
        <div class="sized">
            <form action="/action.php" method="post">Stop: <input name="stop" type="text" /> 
                <br /> 
                <textarea cols="20" name="comments" rows="5">Add items</textarea>
                <br /> <input type="submit" value="Submit" />
            </form>
        </div>
        <br />
        <div class="sized">
            <form action="/action.php" method="post"> Search stop:
                <select name="Stop 1">
                    <option selected="selected" value="stop">Stop 1</option>
                    <option value="stop">Stop 2</option>
                    <option value="stop">Stop 3</option>
                    <option value="stop">Stop 4</option>
                    <option value="stop">Stop 5</option>
                    <option value="stop">Stop 6</option>
                    <option value="stop">Stop 7</option>
                </select> 
                <br /> 
                <textarea cols="20" name="comments" rows="5">Add items</textarea> 
                <br /> 
                <input type="submit" value="Submit"/>
        </form>
        </div>
        <br />
        <div class="tabled">
            <table>
                <tr>
                    <th> Stop 1: Item List</th>
                </tr>
                <tr class="indented">
                    milk
                </tr>
                <tr class="indented">
                    eggs
                </tr>
                <tr>
                    <th> Stop 2: Item List</th>
                </tr>
                <tr class="indented">
                    pick up Emily
                </tr>
                <tr>
                    <th> Stop 3: Item List</th>
                </tr>
                <tr class="indented">
                    coffee
                </tr>
                <tr>
                    <th> Stop 4: Item List</th>
                </tr>
                <tr class="indented">
                    dress fitting
                </tr>
                <tr class="indented">
                    pick up hair piece
                </tr>
                <tr>
                    <th> Stop 5: Item List</th>
                </tr>
                <tr class="indented">
                    rice
                </tr>
                <tr class="indented">
                    tomato sauce
                </tr>
                <tr class="indented">
                    hot dogs
                </tr>
                <tr class="indented">
                    tortillas
                </tr>
                <tr>
                    <th> Stop  6: Item List</th>
                </tr>
                <tr class="indented">
                    pizza
                </tr>
                <tr>
                    <th> Stop 7: Item List</th>
                </tr>
                <tr class="indented">
                    pick up FedEx
                </tr>
            </table>                
        </div>
        <br />
        <div class="boxed">
            <white>
                <strong>Leave Route</strong>
            </white>
        </div>
        <br />
        <br />
        <div>
            <Button onClick={handleSubmit}>Leave Route</Button>
        </div>
    </>
    )
}