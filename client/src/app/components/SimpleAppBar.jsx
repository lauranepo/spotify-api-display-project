"use client";
"use strict";

import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";

export default function SimpleAppBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const onLogout = async () => {
    try {
      await axios.get("http://localhost:8080/logout", {
        withCredentials: true,
      });
      window.location.href = "http://localhost:3000";
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const determineIsAuthenticated = async () => {
      try {
        await axios
          .get("http://localhost:8080/user", {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.user) {
              setIsAuthenticated(true);
              return;
            }
          });
      } catch (error) {
        console.error(error);
      }
    };
    determineIsAuthenticated();
  }, []);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ backgroundColor: "#B55085" }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            playlist analyzer
          </Typography>
          <Button
            onClick={isAuthenticated ? onLogout : onClick}
            float="right"
            variant="contained"
            sx={{
              fontFamily: "Roboto, sans-serif",
              backgroundColor: "white",
              color: "#B55085",
              fontWeight: "bold",
            }}
          >
            {isAuthenticated ? "Logout" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
