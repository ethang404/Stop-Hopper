import "./App.css";
import { Login, Register } from "./login_Register/";
import { NavigateHome } from "./navigation/NavigateHome";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route exact path="/Login" element={<Login />}></Route>
					<Route exact path="/Register" element={<Register />}></Route>
					<Route element={<PrivateRoutes />}>
						<Route path="/Home" element={<NavigateHome />}></Route>
					</Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
