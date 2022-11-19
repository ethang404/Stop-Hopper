import { Button, TextField, Fab } from "@mui/material";
import { useEffect, useState } from "react";
export default function AddStop() {
	const [stop, setStop] = useState();
	return (
		<div>
			<div>
				<TextField
					id="filled-basic"
					//className="TextField"
					label="Add a Task"
					//name={task.Stop}
					variant="filled"
					value={stop}
					onChange={(e) => setStop(e.target.value)}
				/>
			</div>
		</div>
	);
}
