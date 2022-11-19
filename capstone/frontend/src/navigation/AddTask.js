import "./addTask.css";
import { Button, TextField, Fab } from "@mui/material";
import { useEffect, useState } from "react";

export default function AddTask() {
	const [task, setTask] = useState();
	return (
		<div className="AddTaskContainer">
			<TextField
				id="filled-basic"
				//className="TextField"
				label="Add a Task"
				//name={task.Stop}
				variant="filled"
				value={task}
				onChange={(e) => setTask(e.target.value)}
			/>
		</div>
	);
}
