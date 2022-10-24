import { Outlet, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
export default function PrivateRoute() {
	const temp = jwt_decode(localStorage.getItem("accessToken"));
	const auth = { token: temp };
	return auth.token ? <Outlet /> : <Navigate to="/" />;
}
