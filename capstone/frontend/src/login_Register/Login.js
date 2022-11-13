import "../App.css";
import "./Login.css";

import {Button, IconButton, InputAdornment, Switch, TextField} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function Login() {
	let navigate = useNavigate();

	// Form and Login Vars
	const emptyDetail = { username: "", password: "", passwordCheck: "", email: "" };
	const [detail, setDetail] = useState(emptyDetail);
	const [authTokens, setAuthTokens] = useState([]);

	// Toggle Show Password Vars
	// Using same state for both boxes, keeping both buttons for clarity
	const [showPassword, setShowPassword] = useState(false);
	const handlePasswordToggle = () => setShowPassword(!showPassword);

	// Login/Register State
	const [showRegister, setShowRegister] = useState(false);

	function resetDetail() {
		setDetail(emptyDetail);
	}

	async function handleRegisterSwitch(event) {
		setShowRegister(event.target.checked)
	}

	async function handleSubmitLogin() {
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

	async function handleSubmitRegister() {
		// Input validation
		if (detail.username.isEmpty) {
			alert("Please provide a username.")
		}

		if (detail.email.isEmpty) {
			alert("Please provide an email.")
		}

		if (detail.password.isEmpty) {
			alert("Please provide a password.")
		}

		if (detail.password !== detail.passwordCheck) {
			alert("Passwords do not match!")
			return
		}

		// Create account via backend API
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
			// Go back to the login state
			setShowRegister(false)
			resetDetail()
		} else {
			console.log("Something went wrong");
			alert("Error with creating user");
			console.log("error");
		}
	}

	/**
	 * Suppress the default form behavior and execute logic to login/register
	 * depending on current state.
	 *
	 * @param event submit event
	 * @returns {Promise<void>} for the respective login/register method
	 */
	async function handleSubmit(event) {
		event.preventDefault();
		if (!showRegister)
			return handleSubmitLogin()
		else
			return handleSubmitRegister()
	}

	function handleChange(e) {
		const { name, value } = e.target;
		setDetail((prevState) => ({ ...prevState, [name]: value }));
	}

	return (
		<form onSubmit={handleSubmit} style={{ margin: "10px" }}>
			<div style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-evenly",
					gap: "10px",
					margin: "auto"
				 }}
				 className={"flex-container"}
			>
				{showRegister &&
					<div>Stop-Hopper Register Account</div>
				}
				{!showRegister &&
					<div>Stop-Hopper Login</div>
				}
				<div>
					<TextField
						fullWidth
						id="username-entry"
						className="TextField"
						label="Username"
						name="username"
						variant="filled"
						value={detail.username}
						onChange={handleChange}
					/>
				</div>
				{ showRegister &&
					<div>
						<TextField
							fullWidth
							id="email-entry"
							className="TextField"
							label="Email"
							name="email"
							variant="filled"
							value={detail.email}
							onChange={handleChange}
						/>
					</div>
				}
				<div>
					<TextField
						fullWidth
						id="password-entry"
						className="TextField"
						label="Password"
						type={showPassword ? "text" : "password"}
						name="password"
						autoComplete="current-password"
						variant="filled"
						value={detail.password}
						onChange={handleChange}
						InputProps={{
							endAdornment: (
								<InputAdornment position={"end"}>
									<IconButton
										aria-label={"toggle password visibility"}
										onClick={handlePasswordToggle}
										onMouseDown={handlePasswordToggle}
										tabIndex={-1}
									>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
				</div>
				{ showRegister &&
					<div>
						<TextField
							fullWidth
							id="password-check-entry"
							className="TextField"
							label="Verify Password"
							type={showPassword ? "text" : "password"}
							name="passwordCheck"
							autoComplete="current-password"
							variant="filled"
							value={detail.passwordCheck}
							onChange={handleChange}
							InputProps={{
								endAdornment: (
									<InputAdornment position={"end"}>
										<IconButton
											aria-label={"toggle password visibility"}
											onClick={handlePasswordToggle}
											onMouseDown={handlePasswordToggle}
											tabIndex={-1}
										>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
					</div>
				}
				<div
					style={{
						display: "flex",
						justifyContent: "space-evenly",
						gap: "10px",
						alignItems: "center"
					}}
					className={"flex-container"}
				>
					<div>
						<Button onClick={handleSubmit} type={"submit"}>
							{showRegister && "Register"}
							{!showRegister && "Login"}
						</Button>
					</div>
					<div style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-evenly",
						gap: "10px",
						alignItems: "center"
					 }}
					 className={"flex-container"}>
						<div>Register?</div>
						<div><Switch checked={showRegister} onChange={handleRegisterSwitch}/></div>
					</div>
				</div>
			</div>
		</form>
	);
}
