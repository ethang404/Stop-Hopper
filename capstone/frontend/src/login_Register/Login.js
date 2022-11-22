import "../App.css";
import "./Login.css";

import { IconButton, InputAdornment, styled, Switch, TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function ShTextField(props) {
	return <TextField
		{...props}
		fullWidth
		className="TextField"
		variant="outlined"
		error={props.helperText.trim() !== ""}
	/>
}

function ShTextFieldPassword(props) {
	// Clone and remove props that aren't related to this component
	// This seems like an anti-pattern/code smell
	const childProps = { ...props}
	delete childProps.handleToggle
	delete childProps.showPassword

	return <ShTextField
		{...childProps}
		type={props.showPassword ? "text" : "password"}
		autoComplete="current-password"
		InputProps={{
			endAdornment: (
				<InputAdornment position={"end"}>
					<IconButton
						aria-label={"toggle password visibility"}
						onClick={props.handleToggle}
						onMouseDown={props.handleToggle}
						tabIndex={-1}
					>
						{props.showPassword ? <Visibility /> : <VisibilityOff />}
					</IconButton>
				</InputAdornment>
			)
		}}
	/>
}

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

	// Error States, non-empty string represents an error with the message
	const [usernameError, setUsernameError] = useState("")
	const [emailError, setEmailError] = useState("")
	const [passwordError, setPasswordError] = useState("")
	const [passwordCheckError, setPasswordCheckError] = useState("")

	function resetDetail() {
		setDetail(emptyDetail);
	}

	async function handleRegisterSwitch(event) {
		setShowRegister(event.target.checked)
		setUsernameError("")
		setEmailError("")
		setPasswordError("")
		setPasswordCheckError("")
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
			setPasswordError("Username or Password is incorrect")
		}
	}

	async function handleSubmitRegister() {
		// Input validation
		if (detail.username.trim() === "") {
			setUsernameError("Please provide a username")
			return
		} else {
			setUsernameError("")
		}

		if (detail.email.trim() === "") {
			setEmailError("Please provide an email")
			return
		} else {
			setEmailError("")
		}

		if (detail.password.trim() === "") {
			setPasswordError("Please provide a password")
			return
		} else {
			setPasswordError("")
		}

		if (detail.password !== detail.passwordCheck) {
			setPasswordCheckError("Passwords do not match")
			return
		} else {
			setPasswordCheckError("")
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
			// Go back to the login state
			setShowRegister(false)
			resetDetail()
		} else {
			setPasswordCheckError("Failed to create account")
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

	// Used for the login/register submit button
	const ColorButton = styled(Button)(({ theme }) => ({
	    color: "#000000",
	    backgroundColor: "#fc7676",
	    '&:hover': {
			backgroundColor: "#c25b5b",
	    },
	}));

	return (
		<form onSubmit={handleSubmit} style={{ margin: "10px" }}>
			<div style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-evenly",
					gap: "10px",
					margin: "auto",
				 	backgroundColor: "#FFFFFF",
					borderRadius: "5px", }}
				 className={"flex-container"} >
				<div style={{
						marginTop: "10px",
						marginLeft: "10px",
						marginRight: "10px",
						fontSize: "24px",
						backgroundColor: "#fc7676",
						borderRadius: "5px"}}>
					<div style={{margin: "5px"}}>
						{showRegister && "Stop-Hopper Account Creation"}
						{!showRegister && "Stop-Hopper Account Login"}
					</div>
				</div>
				<div style={{marginLeft: "10px", marginRight: "10px"}}>
					<ShTextField
						id="username-entry"
						label="Username"
						name="username"
						value={detail.username}
						onChange={handleChange}
						helperText={usernameError}
					/>
				</div>
				{ showRegister &&
					<div style={{marginLeft: "10px", marginRight: "10px"}}>
						<ShTextField
							id="email-entry"
							label="Email"
							name="email"
							value={detail.email}
							onChange={handleChange}
							helperText={emailError}
						/>
					</div>
				}
				<div style={{marginLeft: "10px", marginRight: "10px"}}>
					<ShTextFieldPassword
						id="password-entry"
						label="Password"
						name="password"
						value={detail.password}
						onChange={handleChange}
						showPassword={showPassword}
						handleToggle={handlePasswordToggle}
						helperText={passwordError}
					/>
				</div>
				{ showRegister &&
					<div style={{marginLeft: "10px", marginRight: "10px"}}>
						<ShTextFieldPassword
							id="password-check-entry"
							label="Verify Password"
							name="passwordCheck"
							value={detail.passwordCheck}
							onChange={handleChange}
							showPassword={showPassword}
							handleToggle={handlePasswordToggle}
							helperText={passwordCheckError}
						/>
					</div>
				}
				<div style={{
						display: "flex",
						justifyContent: "space-evenly",
						gap: "10px",
						alignItems: "center" }}
					className={"flex-container"} >
					<div style={{
							width: "100%",
							height: "100%",
							marginLeft: "10px",
							marginBottom: "10px"}} >
						<ColorButton
							onClick={handleSubmit}
							type={"submit"}
							style={{fontSize: "12pt", color: "#000000"}}
							sx={{ boxShadow: 0 }}
							fullWidth
							variant={"contained"}>
							{showRegister && "Register"}
							{!showRegister && "Login"}
						</ColorButton>
					</div>
					<div style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-evenly",
						alignItems: "center",
						width: "100%",
						height: "100%",
						marginRight: "10px",
						marginBottom: "10px",
						backgroundColor: "#fc7676",
						borderRadius: "5px" }}
					className={"flex-container"}>
						<div>REGISTER?</div>
						<div><Switch checked={showRegister} onChange={handleRegisterSwitch}/></div>
					</div>
				</div>
			</div>
		</form>
	);
}
