"use client";
"use strict";

import styles from "./page.module.css";

import { useEffect, useState } from "react";
import axios from "axios";
import PlaylistCards from "./components/PlaylistCards";
import ExpiredModal from "./components/ExpiredModal";
import SimpleAppBar from "./components/SimpleAppBar";

export default function Home() {
  const [token, setToken] = useState("");
  const [shouldRefreshToken, setShouldRefreshToken] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const determineIsAuthenticated = () => {
    return token && !shouldRefreshToken;
  };

  const onLogout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    setPlaylists([]);
  };

  const handleCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code) {
      try {
        const response = await axios.post("http://localhost:8080/callback", {
          code,
          state,
        });

        console.log("Access Token:", response.data.access_token);
        // Store token for future API calls
      } catch (error) {
        console.error("Error exchanging code:", error);
      }
    } else {
      console.error("No authorization code found.");
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(
    determineIsAuthenticated(),
  );

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

  // useEffect(() => {
  //   setIsAuthenticated(determineIsAuthenticated());
  //   if (token) {
  //     getPlaylists();
  //   }
  // }, [token]);

  // useEffect(() => {
  //   setIsAuthenticated(determineIsAuthenticated());
  //   if (shouldRefreshToken) {
  //     window.localStorage.clear("token");
  //   }
  // }, [shouldRefreshToken]);

  return (
    <>
      <SimpleAppBar isLoggedIn={isAuthenticated} onLogout={onLogout} />
      <div className={styles.main} style={{ backgroundColor: "#ffcdb2" }}>
        <PlaylistCards playlists={playlists} />
        {shouldRefreshToken && <ExpiredModal shouldShow={shouldRefreshToken} />}
      </div>
    </>
  );
}
