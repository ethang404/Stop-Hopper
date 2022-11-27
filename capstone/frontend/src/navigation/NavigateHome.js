import { Button, TextField, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import "./Navhome.css";
import { useNavigate, useParams } from "react-router-dom";

export default function NavigateHome() {
	let navigate = useNavigate();
	const [isPopUp, setPopUp] = useState(false);
	const [favRoutes, setFavRoutes] = useState([]);
	const [code, setCode] = useState("");

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
	function popUp(e) {
		if (isPopUp) {
			setPopUp(false);
			console.log(isPopUp);
		} else {
			setPopUp(true);
			console.log(isPopUp);
		}
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

	useEffect(() => {
		getFavRoutes();
	}, []);
	async function getFavRoutes() {
		let resp = await fetch("http://127.0.0.1:8000/api/getRoutes/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
		});
		let data = await resp.json();
		console.log(data);
		setFavRoutes(data);
	}
	async function handleSubmit() {
		console.log(data);
		let response = await fetch("http://127.0.0.1:8000/api/submitStop/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify(data),
		});
		let res = await response.json();
		let code = res.RouteCode;
		console.log(res);
		console.log(code);
		if (response.ok) {
			console.log("everything is good");
			alert("Routing Began!");
			navigate("/RouteMenu/" + code); //make dynamic later
		} else {
			console.log("Something went wrong");
			console.log("error");
		}
	}
	//map fav routes
	return (
		<div className="Container">
			<h2>List of Favorited Routes: </h2>
			{favRoutes.map((route) => (
				<div key={route.id} onClick={() => navigate("/RouteMenu/" + route.routeCode)}>
					<h3>{route.routeCode}</h3>
				</div>
			))}
			<section className="StartNav">
				<section className="NavigationFields">
					<section className="inputGroup">
						<TextField
							id="filled-basic"
							className="TextField"
							label="Point of Origin"
							name="Stop"
							variant="filled"
							value={data[0].Stop}
							onChange={(e) => handleChange(e, 0)}
						/>
					</section>
					<section className="inputGroup">
						<TextField
							id="filled-basic"
							className="TextField"
							label="Stop #2"
							name="Stop"
							variant="filled"
							value={data[1].Stop}
							onChange={(e) => handleChange(e, 1)}
						/>
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
									value={data[1].Priority}
									onChange={(e) => handleChange(e, 1)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="Arrive By(what time to arrive at stop): "
									helperText="What time to arrive at stop by"
									name="ArriveBy"
									variant="filled"
									value={data[1].ArriveBy}
									onChange={(e) => handleChange(e, 1)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="TaskName"
									helperText="What todo"
									name="TaskName"
									variant="filled"
									value={data[1].TaskName}
									onChange={(e) => handleChange(e, 1)}
								/>
							</div>
						) : null}
					</section>
					<section className="inputGroup">
						<TextField
							id="filled-basic"
							className="TextField"
							label="Stop #3"
							name="Stop"
							variant="filled"
							value={data[2].Stop}
							onChange={(e) => handleChange(e, 2)}
						/>
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
									value={data[2].Priority}
									onChange={(e) => handleChange(e, 2)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="Arrive By(what time to arrive at stop): "
									helperText="What time to arrive at stop by"
									name="ArriveBy"
									variant="filled"
									value={data[2].ArriveBy}
									onChange={(e) => handleChange(e, 2)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="TaskName"
									helperText="What todo"
									name="TaskName"
									variant="filled"
									value={data[2].TaskName}
									onChange={(e) => handleChange(e, 2)}
								/>
							</div>
						) : null}
					</section>
					<section className="inputGroup">
						<TextField
							id="filled-basic"
							className="TextField"
							label="Stop #4"
							name="Stop"
							variant="filled"
							value={data[3].Stop}
							onChange={(e) => handleChange(e, 3)}
						/>
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
					<section className="inputGroup">
						<TextField
							id="filled-basic"
							className="TextField"
							label="Stop #5"
							name="Stop"
							variant="filled"
							value={data[4].Stop}
							onChange={(e) => handleChange(e, 4)}
						/>
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
									value={data[4].Priority}
									onChange={(e) => handleChange(e, 4)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="Arrive By(what time to arrive at stop): "
									helperText="What time to arrive at stop by"
									name="ArriveBy"
									variant="filled"
									value={data[4].ArriveBy}
									onChange={(e) => handleChange(e, 4)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="TaskName"
									helperText="What todo"
									name="TaskName"
									variant="filled"
									value={data[4].TaskName}
									onChange={(e) => handleChange(e, 4)}
								/>
							</div>
						) : null}
					</section>
					<section className="inputGroup">
						<TextField
							id="filled-basic"
							className="TextField"
							label="Stop #6"
							name="Stop"
							variant="filled"
							value={data[5].Stop}
							onChange={(e) => handleChange(e, 5)}
						/>
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
									value={data[5].Priority}
									onChange={(e) => handleChange(e, 5)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="Arrive By(what time to arrive at stop): "
									helperText="What time to arrive at stop by"
									name="ArriveBy"
									variant="filled"
									value={data[5].ArriveBy}
									onChange={(e) => handleChange(e, 5)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="TaskName"
									helperText="What todo"
									name="TaskName"
									variant="filled"
									value={data[5].TaskName}
									onChange={(e) => handleChange(e, 5)}
								/>
							</div>
						) : null}
					</section>
					<section className="inputGroup">
						<TextField
							id="filled-basic"
							className="TextField"
							label="Stop #7"
							name="Stop"
							variant="filled"
							value={data[6].Stop}
							onChange={(e) => handleChange(e, 6)}
						/>
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
									value={data[6].Priority}
									onChange={(e) => handleChange(e, 6)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="Arrive By(what time to arrive at stop): "
									helperText="What time to arrive at stop by"
									name="ArriveBy"
									variant="filled"
									value={data[6].ArriveBy}
									onChange={(e) => handleChange(e, 6)}
								/>
								<TextField
									id="filled-basic"
									className="TextField"
									label="TaskName"
									helperText="What todo"
									name="TaskName"
									variant="filled"
									value={data[6].TaskName}
									onChange={(e) => handleChange(e, 6)}
								/>
							</div>
						) : null}
					</section>
					<Button
						variant="outlined"
						color="secondary"
						className="NavigateButton"
						onClick={handleSubmit}
					>
						Start Navigation
					</Button>
				</section>
			</section>
			<h3>--Or--</h3>
			<section className="JoinRoom">
				<TextField
					id="standard-basic"
					label="RoomCode"
					variant="standard"
					value={code}
					onChange={(e) => setCode(e.target.value)}
				/>
				<Button
					variant="outlined"
					color="error"
					className="JoinRoomButton"
					onClick={() => navigate("/Room/" + code)}
				>
					Join Route Room
				</Button>
			</section>
		</div>
	);
}
