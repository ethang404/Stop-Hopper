import "./PopUp.css";
import { Button, TextField, Fab } from "@mui/material";
export default function NavigatePopup() {
	return (
		<div className="main">
			<TextField
				id="filled-basic"
				className="TextField"
				label="Priority(1-7): "
				helperText="1-highest priority(first stop), 7-last"
				variant="filled"
			/>
			<TextField
				id="filled-basic"
				className="TextField"
				label="Arrive By(what time to arrive at stop): "
				helperText="What time to arrive at stop by"
				variant="filled"
			/>
		</div>
	);
}
