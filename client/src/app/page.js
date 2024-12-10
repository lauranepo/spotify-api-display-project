"use client";
"use strict";

import styles from "./page.module.css";

import { useState } from "react";
import PlaylistCards from "./components/PlaylistCards";
import ExpiredModal from "./components/ExpiredModal";
import SimpleAppBar from "./components/SimpleAppBar";

export default function Home() {
  const [token, setToken] = useState("");
  const [shouldRefreshToken, setShouldRefreshToken] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const determineIsAuthenticated = () => {
    return token;
  };

  const onLogout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    setPlaylists([]);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(
    determineIsAuthenticated(),
  );

  return (
    <>
      <SimpleAppBar isLoggedIn={isAuthenticated} onLogout={onLogout} />
      <div className={styles.main} style={{ backgroundColor: "#ffcdb2" }}>
        <PlaylistCards playlists={playlists} />
        {/* {shouldRefreshToken && <ExpiredModal shouldShow={shouldRefreshToken} />} */}
      </div>
    </>
  );
}
