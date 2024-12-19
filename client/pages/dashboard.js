import { useEffect, useState } from "react";
import axios from "axios";
import PlaylistCards from "@/app/components/PlaylistCards";

const Dashboard = () => {
  const [codeVerifier, setCodeVerifier] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    if (codeVerifier === null) {
      setCallback(false);
    }
  }, [codeVerifier]);

  useEffect(() => {
    const getCallback = async () => {
      let url = new URL(window.location.href);
      let paramCode = url.searchParams.get("code");
      let paramCodeVerifier = window.localStorage.getItem("code_verifier");
      try {
        await axios
          .get("http://localhost:8080/callback", {
            params: { code: paramCode, code_verifier: paramCodeVerifier },
            withCredentials: true,
          })
          .then((res) => {
            setCallback(true);
          });
      } catch (error) {
        console.error("Error during authentication:", error);
        setCallback(false);
      }
    };
    getCallback();
  }, [callback]);

  useEffect(() => {
    if (callback) {
      const getPlaylists = async () => {
        await axios
          .get("http://localhost:8080/playlists", { withCredentials: true })
          .then((res) => {
            setPlaylists(res.data.data.items);
          });
      };
      if (callback) {
        getPlaylists();
      }
    }
  }, [callback]);

  return (
    <div>
      <PlaylistCards playlists={playlists} />
    </div>
  );
};

export default Dashboard;
