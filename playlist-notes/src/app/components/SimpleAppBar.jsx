"use client";
"use strict";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function SimpleAppBar({ isLoggedIn, onLogout }) {
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT;
  const RESPONSE_TYPE = process.env.RESPONSE_TYPE;
  const SCOPES = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-private",
    "user-library-read",
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            playlist analyzer
          </Typography>
          {!isLoggedIn ? (
            <Button
              float="right"
              variant="contained"
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
            >
              Login
            </Button>
          ) : (
            <Button
              float="right"
              variant="contained"
              onClick={() => onLogout()}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
