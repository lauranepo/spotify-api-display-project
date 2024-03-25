"use client"

import Image from "next/image";
import styles from "./page.module.css";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const CLIENT_ID = process.env.REACT_APP_SECRET_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [playlists, setPlaylists] = useState([]);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const getPlaylists = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    setPlaylists(data.items.map(p => p.name));
  };

  // TODO: use component to display each?
  const showPlaylists = () => {
    return playlists.map(playlist => (
      <p key={playlist}>{playlist}</p>
    ))
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

  // useEffect(() => {
  //   getPlaylists();
  // }, [token]);
  
  // TODO: proper login/logout layout
  return (
    <div className="App">
      <header className="App-header">
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
          : <button onClick={logout}>Logout</button>
        }
        {/* {showPlaylists()} */}
      </header>
    </div>
  );
}
