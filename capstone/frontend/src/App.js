import "./App.css";
import Register from "./login_Register/Register";
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
					<Route exact path="/Register" element={<Register />}></Route>
					<Route exact path="/Login" element={<Login />}></Route>
					<Route element={<PrivateRoute />}>
						<Route path="/Home" element={<NavigateHome />}></Route>
						<Route path="/RouteMenu/:code" element={<RouteMenu />}></Route>
						<Route path="/Room" element={<Room />}></Route>
					</Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
