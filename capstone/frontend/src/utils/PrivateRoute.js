import { Outlet, Navigate } from "react-router-dom";
//import jwt_decode from "jwt-decode";
export default function PrivateRoute() {
	//const temp = jwt_decode(localStorage.getItem("authTokens"));
	//const[userID,setUserID] = useState("");
	//const auth = { token: temp };
	const tempTest = true;
	return tempTest ? <Outlet /> : <Navigate to="/Login" />;
}
