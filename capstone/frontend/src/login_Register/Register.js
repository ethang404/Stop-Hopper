import { Button, TextField, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
export default function Register() {
	let navigate = useNavigate();
	const [detail, setDetail] = useState({ username: "", password: "" });

	async function handleSubmit() {
		let response = await fetch("http://127.0.0.1:8000/api/register/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(detail),
		});
		if (response.ok) {
			console.log("everything is good");
			alert("Account Created!");
			navigate("/Login");
		} else {
			console.log("Something went wrong");
			alert("Error with creating user");
			console.log("error");
		}
	}
	function handleChange(e) {
		const { name, value } = e.target;
		setDetail((prevState) => ({ ...prevState, [name]: value }));
	}
	return (
		<div>
			This is my Register page
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
			<Button onClick={handleSubmit}>Create Account</Button>
		</div>
	);
}
