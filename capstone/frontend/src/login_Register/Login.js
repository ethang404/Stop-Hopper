import { Button, TextField, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
export default function Login() {
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
	async function handleSubmitRegistration() {
		navigate("/Register");
	}

	function handleChange(e) {
		const { name, value } = e.target;
		setDetail((prevState) => ({ ...prevState, [name]: value }));
	}
	return (
		<div>
			<br/>
			<br/>
			Welcome to the Login page
			<br/>
			<br/> 
			<TextField
				id="filled-basic"
				className="TextField"
				label="UserName"
				name="username"
				variant="filled"
				value={detail.username}
				onChange={handleChange}
			/>
			<TextField
				id="filled-basic"
				className="TextField"
				label="Password"
				name="password"
				variant="filled"
				value={detail.password}
				onChange={handleChange}
			/>
			<Button onClick={handleSubmit}>Login</Button>
			<br/>
			<br/>
			<Button onClick={handleSubmitRegistration}>Register</Button>
		</div>
	);
}
