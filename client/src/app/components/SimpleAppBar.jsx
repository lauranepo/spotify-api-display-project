"use client";
"use strict";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";

export default function SimpleAppBar({ isLoggedIn }) {
  const onClick = async () => {
    try {
      const response = await axios.get("http://localhost:8080/login", {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const { url, code_verifier } = response.data;
      window.location.href = url;
      window.localStorage.setItem("code_verifier", code_verifier);
    } catch (error) {
      console.error(error);
    }
  };

  const onLogout = () => {
    window.localStorage.clear("code_verifier");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ backgroundColor: "#e5989b" }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            playlist analyzer
          </Typography>
          <Button
            onClick={onClick}
            float="right"
            variant="contained"
            style={{ backgroundColor: "#ffcdb2", fontWeight: "bold" }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
