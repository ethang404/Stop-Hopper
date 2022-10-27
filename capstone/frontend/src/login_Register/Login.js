import "../App.css";
import "./Login.css";

import { Button, Divider, List, ListItem, ListItemText, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
	let navigate = useNavigate();
	const [detail, setDetail] = useState({ username: "", password: "" });
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
	function handleChange(e) {
		const { name, value } = e.target;
		setDetail((prevState) => ({ ...prevState, [name]: value }));
	}
	return (
		<div>
			<br/>
			Stop-Hopper Login
			<br/>
			<br/>
			<TextField
				id="filled-basic"
				className="TextField"
				label="Username"
				name="username"
				variant="filled"
				value={detail.username}
				onChange={handleChange}
			/>
			<br/>
			<br/>
			<TextField
				id="filled-basic"
				className="TextField"
				label="Password"
				name="password"
				variant="filled"
				value={detail.password}
				onChange={handleChange}
			/>
			<br/>
			<br/>
			<Button onClick={handleSubmit}>Login</Button>
		</div>
	);
}
