import "./App.css";
import Login from "./login_Register/Login";
import NavigateHome from "./navigation/NavigateHome";
import RouteMenu from "./navigation/RouteMenu";
import Room from "./room/Room";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route exact path="/" element={<Login />}></Route>
					<Route exact path="/Login" element={<Login />}></Route>
					<Route element={<PrivateRoute />}>
						<Route path="/Home" element={<NavigateHome />}></Route>
						<Route path="/RouteMenu/:code" element={<RouteMenu />}></Route>
						<Route path="/Room/:code" element={<Room />}></Route>
					</Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
