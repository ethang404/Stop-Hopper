import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {ShColorButton, ShColorButtonNoFullWidth, ShThemeDiv} from "./ShComponents";
import {Label} from "@mui/icons-material";
import {AppBar, Box, Button, IconButton, styled, Toolbar, Typography} from "@mui/material";
import {logout} from "./StopHopperApi";

const BlackText = styled(Typography)(({ theme }) => ({
	color: "#000000",
}));

export default function NavBar(props) {
    const navigate = useNavigate();

    // Inferior check, only looks at if an accessToken is present
    const loggedIn = localStorage.getItem("accessToken") !== null;

    // Not sure why margin isn't working, this achieves the desired spacing effect
    const buttonStyle = { fontSize: "16px", margin: "10px" }

    return <div>
        <ShThemeDiv style={{
            // backgroundColor: "#fc7676",
            margin: "10px"}}>
            <div style={{
                margin: "10px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px", }} >
                <BlackText
                    variant={"h5"}
                    noWrap
                    component={"div"}
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    style={{ margin: "10px" }}
                >
                    Stop-Hopper
                </BlackText>
                <div>
                    <ShColorButtonNoFullWidth
                        key={"Home"}
                        style={buttonStyle}
                        onClick={() => navigate("/Home")}
                    >
                        Navigation
                    </ShColorButtonNoFullWidth>
                    { !loggedIn &&
                        <ShColorButtonNoFullWidth
                            key={"Login"}
                            style={{fontSize: "16px", margin: "10px"}}
                            onClick={() => navigate("/Login")}
                        >
                            Login
                        </ShColorButtonNoFullWidth>
                    }
                    { loggedIn &&
                        <ShColorButtonNoFullWidth
                            key={"Logout"}
                            style={{ fontSize: "16px", margin: "10px",}}
                            onClick={() => { logout(); navigate("/"); }}
                            >
                            Logout
                        </ShColorButtonNoFullWidth>
                    }
                </div>
            </div>
        </ShThemeDiv>
    </div>
}