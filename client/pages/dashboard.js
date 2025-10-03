import { useEffect, useState } from "react";
import axios from "axios";
import PlaylistCards from "@/app/components/PlaylistCards";
import { Box, Container } from "@mui/material";
import SimpleAppBar from "@/app/components/SimpleAppBar";

const Dashboard = () => {
  const [playlists, setPlaylists] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndInit = async () => {
      try {
        // Check if handling callback
        const url = new URL(window.location.href);
        const paramCode = url.searchParams.get("code");

        if (paramCode) {
          const paramCodeVerifier =
            window.localStorage.getItem("code_verifier");
          if (!paramCodeVerifier) {
            console.error("No code verifier found");
            return;
          }

          await axios.get("http://localhost:8080/callback", {
            params: { code: paramCode, code_verifier: paramCodeVerifier },
            withCredentials: true,
          });

          window.localStorage.removeItem("code_verifier");
        }

        const userResponse = await axios.get("http://localhost:8080/user", {
          withCredentials: true,
        });

        setIsAuthenticated(userResponse.data.user);
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthAndInit();
  }, []);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        if (isAuthenticated) {
          const response = await axios.get("http://localhost:8080/playlists", {
            withCredentials: true,
          });
          setPlaylists(response.data.data.items);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
        setPlaylists(null);
      }
    };

    getPlaylists();
  }, [isAuthenticated]);

  return (
    <Container sx={{ padding: "30px", margin: "auto" }}>
      <SimpleAppBar />
      <Box sx={{ paddingTop: "70px" }}>
        <PlaylistCards playlists={playlists} />
      </Box>
    </Container>
  );
};

export default Dashboard;
