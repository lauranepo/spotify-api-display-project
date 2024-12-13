"use client";
"use strict";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";

export default function NavBar({ props }) {
  const onClick = async () => {
    try {
      const response = await axios.get("http://localhost:8080/login");
      console.log(response.data);
      const { url, codeVerifier } = response.data;
      window.location.href = url;
      window.localStorage.setItem("code_verifier", codeVerifier);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ backgroundColor: "#e5989b" }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            playlist analyzer
          </Typography>
          {!isLoggedIn ? (
            <Button
              onClick={onClick}
              float="right"
              variant="contained"
              style={{ backgroundColor: "#ffcdb2", fontWeight: "bold" }}
            >
              Login
            </Button>
          ) : (
            <Button
              float="right"
              variant="contained"
              onClick={() => onLogout()}
              style={{ backgroundColor: "#ffcdb2", fontWeight: "bold" }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
