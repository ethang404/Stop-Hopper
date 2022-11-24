import {Button, TextField, InputAdornment, IconButton, styled} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Component } from "react";
import "./Navhome.css";
import {useNavigate} from "react-router-dom";

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

	return <ShThemeDiv style={{backgroundColor: "#ffdddd"}}>
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
					style={{marginTop: "10px"}}
					type={"number"}
					label={"Priority"}
					name={"Priority"}
					value={props.priorityValue}
					onChange={(e) => {
						console.log(e.target.value)
						if (e.target.value >= -3 && e.target.value <= 3) {
							return props.onChange(e)
						}
					}}
				/>
				<ShTextField
					{...childProps}
					style={{marginTop: "10px"}}
					label={"Arrive By"}
					name={"ArriveBy"}
					value={props.arriveValue}
					onChange={props.onChange}
				/>
			</div>
			<ShTextField
				{...childProps}
				style={{marginBottom: "10px"}}
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
		// 	Priority: "0",
		// 	ArriveBy: "",
		// 	TaskName: "",
		//  Edit: false,
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
			Priority: "0",
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
				{this.state.stops.length > 0 &&
					<div style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-evenly",
						gap: "10px",
						}}>
						{this.state.stops.map((curVal, index, arr) => {
							return <div key={index}>
								<StopEntryField
									id={index.toString()}
									label={"Stop #" + (index + 1).toString()}
									name={"Stop"}
									value={this.state.stops[index].Stop}
									onChange={this.updateStop.bind(this)}
									editStop={(e) => this.toggleEdit.bind(this)(e, index)}
								/>
								{this.state.stops[index].Edit &&
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
				}
				{/* Add Stop Button */}
				<div style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-evenly",
					gap: "10px",
					}}>
				{this.state.stops.length < 7 &&
					<ColorButton
						fullWidth
						onClick={this.addStop.bind(this)} >
						Add Stop
					</ColorButton>
				}
				{this.state.stops.length > 0 &&
					<ColorButton
						fullWidth
						onClick={() => { this.props.startRouting(this.state.stops) }} >
						Start Route
					</ColorButton>
				}
				</div>
			</div>
		</ShThemeDiv>
	}
}

export default function NavigateHome() {
	let navigate = useNavigate();

	/**
	 * Collect data from the stops and redirect to the navigation page
	 *
	 * @returns {Promise<void>}
	 */
	async function startRouting(stops) {
		// Get our stops and strip out unnecessary data
		const data = [...stops]
		data.map(stop => { delete stop.Edit })

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

		if (response.ok) {
			navigate("/RouteMenu/" + code);
		} else {
			alert("Error " + res)
		}
	}

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
			<StopList startRouting={startRouting}/>
		</div>
	)
}
