"use client";
"use strict";

import styles from "./page.module.css";

import { useState, useEffect } from "react";
import PlaylistCards from "./components/PlaylistCards";
import ExpiredModal from "./components/ExpiredModal";
import SimpleAppBar from "./components/SimpleAppBar";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const codeVerifier = searchParams.get("code");
  const state = searchParams.get("state");

  const [playlists, setPlaylists] = useState([]);

  const getPlaylists = async () => {
    if (codeVerifier) {
      await axios.get("http://localhost:8080/playlists").then((res) => {
        setPlaylists(res.data);
      });
    }
  };

  useEffect(() => {
    getPlaylists();
  }, [codeVerifier]);

  return (
    <>
      <SimpleAppBar isLoggedIn={state !== ""} />
      <div className={styles.main}>
        <PlaylistCards playlists={playlists} />
      </div>
    </>
  );
}
