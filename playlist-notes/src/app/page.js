"use client"

import styles from "./page.module.css";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography } from "@mui/material";
import PlaylistCards from "./PlaylistCards";

export default function Home() {
  const CLIENT_ID = process.env.REACT_APP_SECRET_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [playlists, setPlaylists] = useState([]);

  const onLogOut = () => {
    setToken("");
    window.localStorage.removeItem("token");
    setPlaylists([]);
  };

  const getPlaylists = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setPlaylists(data.items);
      console.log(playlists);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      // TODO: fix this code I don't like it??
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  useEffect(() => {
    getPlaylists();
  }, [token]);

  // TODO: proper login/logout layout
  return (
    <div className={styles.main}>
      <header className={styles.header}>
        {!token ?
          <Button
              color="secondary"
              variant="contained"
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
              classes={styles.rightAlign}>
                Login to Spotify
          </Button>
            : 
            <Button
              color="secondary"
              variant="contained"
              onClick={onLogOut}
              classes={styles.rightAlign}
            >
              Logout
            </Button>
        }
        <Typography variant="h1">song description adder</Typography>
      </header>
      <PlaylistCards playlists={playlists}/>
    </div>
  );
}