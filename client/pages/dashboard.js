import { useEffect, useState } from "react";
import axios from "axios";
import PlaylistCards from "@/app/components/PlaylistCards";
import { Box, Container } from "@mui/material";
import SimpleAppBar from "@/app/components/SimpleAppBar";

const Dashboard = () => {
  const [playlists, setPlaylists] = useState(null);
  const [callback, setCallback] = useState(false);

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
      const getPlaylists = async () => {
        await axios
          .get("http://localhost:8080/playlists", { withCredentials: true })
          .then((res) => {
            setPlaylists(res.data.data.items);
          });
      };
      if (callback || playlists === null) {
        getPlaylists();
      }
  }, []);

  return (
    <Container sx={{padding: "30px", margin: "auto"}}>
      <SimpleAppBar />
      <Box sx={{ paddingTop: "70px" }}>
        <PlaylistCards playlists={playlists} />
      </Box>
    </Container>
  );
};

export default Dashboard;
