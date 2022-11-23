import {Button, TextField, InputAdornment, IconButton, styled} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Component } from "react";
import "./Navhome.css";

const ColorButton = styled(Button)(({ theme }) => ({
	color: "#000000",
	backgroundColor: "#fc7676",
	'&:hover': {
		backgroundColor: "#c25b5b",
	},
}));

function ShThemeDiv(props) {
	const newStyle = (props.style === undefined) ? {} : {...props.style}
	if (newStyle.backgroundColor === undefined)
		newStyle.backgroundColor = "#FFFFFF"
	if (newStyle.borderRadius === undefined)
		newStyle.borderRadius = "5px"

	const newProps = {...props}
	newProps.style = newStyle

	return <div
		{...newProps}
	/>
}

/**
 * Base text field
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ShTextField(props) {
	return <TextField
		{...props}
		fullWidth
		className="TextField"
		variant="outlined"
	/>
}

/**
 * A Text entry field for stops which has an edit button.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function StopEntryField(props) {
	const childProps = {...props}
	delete childProps.editStop

	return <ShTextField
		{...childProps}
		error={(props.helperText === undefined) ? false : props.helperText.trim() !== ""}
		InputProps={{
			endAdornment: (
				<InputAdornment position={"end"}>
					<IconButton
						aria-label={"Edit Stop Details"}
						onClick={props.editStop}
						tabIndex={-1}
					>
						 <EditIcon />
					</IconButton>
				</InputAdornment>
			)
		}}
	/>
}

/**
 * Various entry fields to edit properties of a stop.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function StopEdit(props) {
	const childProps = {...props}
	delete childProps.priorityValue
	delete childProps.arriveValue
	delete childProps.notesValue
	delete childProps.onChange

	return <ShThemeDiv>
		<div
			{...childProps}
			style={{
				margin: "10px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-evenly",
				gap: "10px", }} >
			<div
				{...childProps}
				style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-evenly",
				gap: "10px", }} >
				<ShTextField
					{...childProps}
					type={"number"}
					label={"Priority (1-7)"}
					name={"Priority"}
					value={props.priorityValue}
					onChange={props.onChange}
				/>
				<ShTextField
					{...childProps}
					label={"Arrive By"}
					name={"ArriveBy"}
					value={props.arriveValue}
					onChange={props.onChange}
				/>
			</div>
			<ShTextField
				{...childProps}
				label={"Notes"}
				name={"TaskName"}
				value={props.notesValue}
				onChange={props.onChange}
			/>
		</div>
	</ShThemeDiv>
}

function JoinRoom(props) {
	return <ShThemeDiv>
		<div
			{...props}
			style={{
				margin: "10px",
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-evenly",
				gap: "10px", }} >
			<ShTextField
				id="room-code-label"
				label="Route Code"
				variant="standard"
				style={{flex: 2}}
				size={"small"}
			/>
			<ColorButton
				variant="contained"
				className="JoinRoomButton"
				style={{flex: 1}}
				sx={{ boxShadow: 0 }} >
				Join Route
			</ColorButton>
		</div>
	</ShThemeDiv>
}

/**
 * A component that renders a list of stops.
 * Spans the height of the screen by default, the width can be passed in.
 */
class StopList extends Component {
	constructor(props) {
		super(props);

		// Stops is a list (?) instead of dict, so we can have .length
		// {
		// 	Stop: "",
		// 	Priority: "1",
		// 	ArriveBy: "",
		// 	TaskName: "",
		// }

		this.state = {
			stops: [],
			popUp: false
		}
	}

	/**
	 * Add a new stop to the end of the stops list, doesn't check limits/bounds
	 */
	addStop() {
		const newStops = [...this.state.stops]
		newStops.push({
			Stop: "",
			Priority: "1",
			ArriveBy: "",
			TaskName: "",
			Edit: false
		})
		this.setState({stops: newStops})
	}

	updateStopLogic(event, index, key, value) {
		const newStops = [...this.state.stops]
		newStops[index][key] = value
		this.setState({stops: newStops})
	}

	updateStop(event) {
		this.updateStopLogic(event, parseInt(event.target.id), event.target.name, event.target.value)
	}

	toggleEdit(event, index) {
		this.updateStopLogic(event, index, "Edit", (!this.state.stops[index].Edit))
	}

	render() {
		return <ShThemeDiv>
			<div style={{
				margin: "10px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-evenly",
				gap: "10px", }} >
				{/* List Stops */}
				<div style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-evenly",
					gap: "10px", }} >
				{
					this.state.stops.map((curVal, index, arr) => {
						return <div key={index}>
							<StopEntryField
								id={index.toString()}
								label={"Stop #" + (index + 1).toString()}
								name={"Stop"}
								value={this.state.stops[index].Stop}
								onChange={this.updateStop.bind(this)}
								editStop={(e) => this.toggleEdit.bind(this)(e, index)}
							/>
							{ this.state.stops[index].Edit &&
								<StopEdit
									id={index.toString()}
									priorityValue={this.state.stops[index].Priority}
									arriveValue={this.state.stops[index].ArriveBy}
									notesValue={this.state.stops[index].TaskName}
									onChange={this.updateStop.bind(this)}
								/>
							}
						</div>
					})
				}
				</div>
				{/* Add Stop Button */}
				<div>
					<Button onClick={this.addStop.bind(this)}>
						Add Stop
					</Button>
				</div>
			</div>
		</ShThemeDiv>
	}
}

// function StopEntrySection(props) {
// 	return <section className="inputGroup">
// 		<StopEntryField
// 			id="filled-basic"
// 			label="Stop #1"
// 			name="Stop"
// 			value={data[0].Stop}
// 			onChange={(e) => handleChange(e, 0)}
// 		/>
// 		<Fab size="small" className="detailButton" aria-label="edit" onClick={popUp}>
// 			<EditIcon />
// 		</Fab>
// 		{isPopUp ? (
// 			<div className="Popup">
// 				<TextField
// 					id="outlined-number"
// 					type="number"
// 					className="TextField"
// 					label="Priority(1-7): "
// 					name="Priority"
// 					value={data[0].Priority}
// 					onChange={(e) => handleChange(e, 0)}
// 				/>
// 				<TextField
// 					id="filled-basic"
// 					className="TextField"
// 					label="Arrive By: "
// 					helperText="What time to arrive at stop by"
// 					name="ArriveBy"
// 					variant="filled"
// 					value={data[0].ArriveBy}
// 					onChange={(e) => handleChange(e, 0)}
// 				/>
// 				<TextField
// 					id="filled-basic"
// 					className="TextField"
// 					label="TaskName"
// 					helperText="What todo"
// 					name="TaskName"
// 					variant="filled"
// 					value={data[0].TaskName}
// 					onChange={(e) => handleChange(e, 0)}
// 				/>
// 			</div>
// 		) : null}
// 	</section>
// }

export default function NavigateHome() {
	// let navigate = useNavigate();
	// const [isPopUp, setPopUp] = useState(false);
	//
	// const [data, setData] = useState([
	// 	{
	// 		Stop: "",
	// 		Priority: null,
	// 		ArriveBy: "",
	// 		TaskName: "",
	// 	},
	// 	{
	// 		Stop: "",
	// 		Priority: null,
	// 		ArriveBy: "",
	// 		TaskName: "",
	// 	},
	// 	{
	// 		Stop: "",
	// 		Priority: null,
	// 		ArriveBy: "",
	// 		TaskName: "",
	// 	},
	// 	{
	// 		Stop: "",
	// 		Priority: null,
	// 		ArriveBy: "",
	// 		TaskName: "",
	// 	},
	// 	{
	// 		Stop: "",
	// 		Priority: null,
	// 		ArriveBy: "",
	// 		TaskName: "",
	// 	},
	// 	{
	// 		Stop: "",
	// 		Priority: null,
	// 		ArriveBy: "",
	// 		TaskName: "",
	// 	},
	// 	{
	// 		Stop: "",
	// 		Priority: null,
	// 		ArriveBy: "",
	// 		TaskName: "",
	// 	},
	// ]);
	// function popUp(e) {
	// 	if (isPopUp) {
	// 		setPopUp(false);
	// 		console.log(isPopUp);
	// 	} else {
	// 		setPopUp(true);
	// 		console.log(isPopUp);
	// 	}
	// }
	// function handleChange(e, index) {
	// 	console.log("index: " + index);
	// 	console.log("property name: " + e.target.name);
	// 	let newArr = [...data]; // copying the old datas array
	// 	// a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
	// 	if (e.target.name === "Stop") {
	// 		newArr[index].Stop = e.target.value;
	// 	} else if (e.target.name === "Priority") {
	// 		newArr[index].Priority = e.target.value;
	// 	} else if (e.target.name === "ArriveBy") {
	// 		newArr[index].ArriveBy = e.target.value;
	// 	} else if (e.target.name === "TaskName") {
	// 		newArr[index].TaskName = e.target.value;
	// 	}
	// 	setData(newArr);
	// }
	//
	// async function handleSubmit() {
	// 	console.log(data);
	// 	let response = await fetch("http://127.0.0.1:8000/api/submitStop/", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
	// 		},
	// 		body: JSON.stringify(data),
	// 	});
	// 	let res = await response.json();
	// 	let code = res.RouteCode;
	// 	console.log(res);
	// 	console.log(code);
	// 	if (response.ok) {
	// 		console.log("everything is good");
	// 		alert("Routing Began!");
	// 		navigate("/RouteMenu/" + "a2zXBs");
	// 		//navigate("/RouteMenu/" + "a2zXBs"); //make dynamic later
	// 	} else {
	// 		console.log("Something went wrong");
	// 		console.log("error");
	// 	}
	// }

	return (
		<div
			className={"flex-container"}
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-evenly",
				gap: "10px",
				marginLeft: "auto",
				marginRight: "auto",
				marginTop: "10px", }} >
			<JoinRoom/>
			<StopList/>
		</div>
	)

	// return (
	// 	<div className="Container">
	// 		<section className="StartNav">
	// 			<section className="NavigationFields">
	// 				<section className="inputGroup">
	// 					<StopEntryField
	// 						id="filled-basic"
	// 						label="Stop #1"
	// 						name="Stop"
	// 						value={data[0].Stop}
	// 						onChange={(e) => handleChange(e, 0)}
	// 					/>
	// 					<Fab size="small" className="detailButton" aria-label="edit" onClick={popUp}>
	// 						<EditIcon />
	// 					</Fab>
	// 					{isPopUp ? (
	// 						<div className="Popup">
	// 							<TextField
	// 								id="outlined-number"
	// 								type="number"
	// 								className="TextField"
	// 								label="Priority(1-7): "
	// 								name="Priority"
	// 								value={data[0].Priority}
	// 								onChange={(e) => handleChange(e, 0)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="Arrive By: "
	// 								helperText="What time to arrive at stop by"
	// 								name="ArriveBy"
	// 								variant="filled"
	// 								value={data[0].ArriveBy}
	// 								onChange={(e) => handleChange(e, 0)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="TaskName"
	// 								helperText="What todo"
	// 								name="TaskName"
	// 								variant="filled"
	// 								value={data[0].TaskName}
	// 								onChange={(e) => handleChange(e, 0)}
	// 							/>
	// 						</div>
	// 					) : null}
	// 				</section>
	// 				<section className="inputGroup">
	// 					<StopEntryField
	// 						id="filled-basic"
	// 						label="Stop #2"
	// 						name="Stop"
	// 						value={data[1].Stop}
	// 						onChange={(e) => handleChange(e, 1)}
	// 					/>
	// 					<Fab size="small" className="detailButton" aria-label="edit" onClick={popUp}>
	// 						<EditIcon />
	// 					</Fab>
	// 					{isPopUp ? (
	// 						<div className="Popup">
	// 							<TextField
	// 								id="outlined-number"
	// 								type="number"
	// 								className="TextField"
	// 								label="Priority(1-7): "
	// 								name="Priority"
	// 								value={data[1].Priority}
	// 								onChange={(e) => handleChange(e, 1)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="Arrive By: "
	// 								helperText="What time to arrive at stop by"
	// 								name="ArriveBy"
	// 								variant="filled"
	// 								value={data[1].ArriveBy}
	// 								onChange={(e) => handleChange(e, 1)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="TaskName"
	// 								helperText="What todo"
	// 								name="TaskName"
	// 								variant="filled"
	// 								value={data[1].TaskName}
	// 								onChange={(e) => handleChange(e, 1)}
	// 							/>
	// 						</div>
	// 					) : null}
	// 				</section>
	// 				<section className="inputGroup">
	// 					<StopEntryField
	// 						id="filled-basic"
	// 						label="Stop #3"
	// 						name="Stop"
	// 						value={data[2].Stop}
	// 						onChange={(e) => handleChange(e, 2)}
	// 					/>
	// 					<Fab size="small" className="detailButton" aria-label="edit" onClick={popUp}>
	// 						<EditIcon />
	// 					</Fab>
	// 					{isPopUp ? (
	// 						<div className="Popup">
	// 							<TextField
	// 								id="outlined-number"
	// 								type="number"
	// 								className="TextField"
	// 								label="Priority(1-7): "
	// 								name="Priority"
	// 								value={data[2].Priority}
	// 								onChange={(e) => handleChange(e, 2)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="Arrive By: "
	// 								helperText="What time to arrive at stop by"
	// 								name="ArriveBy"
	// 								variant="filled"
	// 								value={data[2].ArriveBy}
	// 								onChange={(e) => handleChange(e, 2)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="TaskName"
	// 								helperText="What todo"
	// 								name="TaskName"
	// 								variant="filled"
	// 								value={data[2].TaskName}
	// 								onChange={(e) => handleChange(e, 2)}
	// 							/>
	// 						</div>
	// 					) : null}
	// 				</section>
	// 				<section className="inputGroup">
	// 					<StopEntryField
	// 						id="filled-basic"
	// 						label="Stop #4"
	// 						name="Stop"
	// 						value={data[3].Stop}
	// 						onChange={(e) => handleChange(e, 3)}
	// 					/>
	// 					<Fab size="small" className="detailButton" aria-label="edit" onClick={popUp}>
	// 						<EditIcon />
	// 					</Fab>
	// 					{isPopUp ? (
	// 						<div className="Popup">
	// 							<TextField
	// 								id="outlined-number"
	// 								type="number"
	// 								className="TextField"
	// 								label="Priority(1-7): "
	// 								name="Priority"
	// 								value={data[3].Priority}
	// 								onChange={(e) => handleChange(e, 3)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="Arrive By: "
	// 								helperText="What time to arrive at stop by"
	// 								name="ArriveBy"
	// 								variant="filled"
	// 								value={data[3].ArriveBy}
	// 								onChange={(e) => handleChange(e, 3)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="TaskName"
	// 								helperText="What todo"
	// 								name="TaskName"
	// 								variant="filled"
	// 								value={data[3].TaskName}
	// 								onChange={(e) => handleChange(e, 3)}
	// 							/>
	// 						</div>
	// 					) : null}
	// 				</section>
	// 				<section className="inputGroup">
	// 					<StopEntryField
	// 						id="filled-basic"
	// 						className="TextField"
	// 						label="Stop #5"
	// 						name="Stop"
	// 						value={data[4].Stop}
	// 						onChange={(e) => handleChange(e, 4)}
	// 					/>
	// 					<Fab size="small" className="detailButton" aria-label="edit" onClick={popUp}>
	// 						<EditIcon />
	// 					</Fab>
	// 					{isPopUp ? (
	// 						<div className="Popup">
	// 							<TextField
	// 								id="outlined-number"
	// 								type="number"
	// 								className="TextField"
	// 								label="Priority(1-7): "
	// 								name="Priority"
	// 								value={data[4].Priority}
	// 								onChange={(e) => handleChange(e, 4)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="Arrive By: "
	// 								helperText="What time to arrive at stop by"
	// 								name="ArriveBy"
	// 								variant="filled"
	// 								value={data[4].ArriveBy}
	// 								onChange={(e) => handleChange(e, 4)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="TaskName"
	// 								helperText="What todo"
	// 								name="TaskName"
	// 								variant="filled"
	// 								value={data[4].TaskName}
	// 								onChange={(e) => handleChange(e, 4)}
	// 							/>
	// 						</div>
	// 					) : null}
	// 				</section>
	// 				<section className="inputGroup">
	// 					<StopEntryField
	// 						id="filled-basic"
	// 						label="Stop #6"
	// 						name="Stop"
	// 						value={data[5].Stop}
	// 						onChange={(e) => handleChange(e, 5)}
	// 					/>
	// 					<Fab size="small" className="detailButton" aria-label="edit" onClick={popUp}>
	// 						<EditIcon />
	// 					</Fab>
	// 					{isPopUp ? (
	// 						<div className="Popup">
	// 							<TextField
	// 								id="outlined-number"
	// 								type="number"
	// 								className="TextField"
	// 								label="Priority(1-7): "
	// 								name="Priority"
	// 								value={data[5].Priority}
	// 								onChange={(e) => handleChange(e, 5)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="Arrive By: "
	// 								helperText="What time to arrive at stop by"
	// 								name="ArriveBy"
	// 								variant="filled"
	// 								value={data[5].ArriveBy}
	// 								onChange={(e) => handleChange(e, 5)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="TaskName"
	// 								helperText="What todo"
	// 								name="TaskName"
	// 								variant="filled"
	// 								value={data[5].TaskName}
	// 								onChange={(e) => handleChange(e, 5)}
	// 							/>
	// 						</div>
	// 					) : null}
	// 				</section>
	// 				<section className="inputGroup">
	// 					<StopEntryField
	// 						id="filled-basic"
	// 						label="Stop #7"
	// 						name="Stop"
	// 						value={data[6].Stop}
	// 						onChange={(e) => handleChange(e, 6)}
	// 					/>
	// 					<Fab size="small" className="detailButton" aria-label="edit" onClick={popUp}>
	// 						<EditIcon />
	// 					</Fab>
	// 					{isPopUp ? (
	// 						<div className="Popup">
	// 							<TextField
	// 								id="outlined-number"
	// 								type="number"
	// 								className="TextField"
	// 								label="Priority(1-7): "
	// 								name="Priority"
	// 								value={data[6].Priority}
	// 								onChange={(e) => handleChange(e, 6)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="Arrive By: "
	// 								helperText="What time to arrive at stop by"
	// 								name="ArriveBy"
	// 								variant="filled"
	// 								value={data[6].ArriveBy}
	// 								onChange={(e) => handleChange(e, 6)}
	// 							/>
	// 							<TextField
	// 								id="filled-basic"
	// 								className="TextField"
	// 								label="TaskName"
	// 								helperText="What todo"
	// 								name="TaskName"
	// 								variant="filled"
	// 								value={data[6].TaskName}
	// 								onChange={(e) => handleChange(e, 6)}
	// 							/>
	// 						</div>
	// 					) : null}
	// 				</section>
	// 				<Button
	// 					variant="outlined"
	// 					color="secondary"
	// 					className="NavigateButton"
	// 					onClick={handleSubmit}
	// 				>
	// 					Start Navigation
	// 				</Button>
	// 			</section>
	// 		</section>
	// 		<h3>--Or--</h3>
	// 		<section className="JoinRoom">
	// 			<TextField id="standard-basic" label="RoomCode" variant="standard" />
	// 			<Button variant="outlined" color="error" className="JoinRoomButton">
	// 				Join Route Room
	// 			</Button>
	// 		</section>
	// 	</div>
	// );
}
