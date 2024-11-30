"use client";
"use strict";

import styles from "./page.module.css";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import PlaylistCards from "./components/PlaylistCards";
import ExpiredModal from "./components/ExpiredModal";

export default function Home() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-private",
    "user-library-read",
  ];

  const [token, setToken] = useState("");
  const [shouldRefreshToken, setShouldRefreshToken] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const onLogOut = () => {
    setToken("");
    window.localStorage.removeItem("token");
    setPlaylists([]);
  };

  const getPlaylists = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.items) {
        setPlaylists(
          data.items.filter((item) => {
            if (item !== null) {
              return item;
            }
          }),
        );
      } else {
        console.error("No playlists found in response");
      }
    } catch (error) {
      if (error.response.status === 401) {
        setShouldRefreshToken(true);
      }
      console.error(error.response.status, error.response.data);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      const urlParams = new URLSearchParams(hash.substring(1));
      token = urlParams.get("access_token");

      if (token) {
        window.localStorage.setItem("token", token);
      } else {
        console.error("No access token found in URL");
      }
    }

    setToken(token);
  }, []);

  useEffect(() => {
    if (token) {
      getPlaylists();
    }
  }, [token]);

  useEffect(() => {
    if (shouldRefreshToken) {
      window.localStorage.clear("token");
    }
  }, [shouldRefreshToken]);

  return (
    <div className={styles.main}>
      <header>
        {!token ? (
          <Button
            color="secondary"
            variant="contained"
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
            classes={styles.rightAlign}
          >
            Login to Spotify
          </Button>
        ) : (
          <Button
            color="secondary"
            variant="contained"
            onClick={onLogOut}
            classes={styles.rightAlign}
          >
            Logout
          </Button>
        )}
        <Typography variant="h2">pick a playlist to analyze</Typography>
      </header>
      {/* Conditional rendering of PlaylistCards */}
      {playlists != null ? (
        <PlaylistCards playlists={playlists} />
      ) : (
        <Typography>no playlists available</Typography>
      )}
      {shouldRefreshToken && <ExpiredModal shouldShow={shouldRefreshToken} />}
    </div>
  );
}
