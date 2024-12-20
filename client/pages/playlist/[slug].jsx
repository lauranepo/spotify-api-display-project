"use strict";

import axios from "axios";
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TrackCards from "@/app/components/TrackCards";

export default function Playlist() {
  const router = useRouter();
  const playlist_id = router.query.slug;
  const [token, setToken] = useState("");
  const [playlistDetails, setPlaylistDetails] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState({});
  const [popularityAverage, setPopularityAverage] = useState();
  const [percentExplicit, setPercentExplicit] = useState();

  // set state for tracks
  const getPopularityAverage = () => {
    let popularitySum = 0;
    let explicitCount = 0;
    let numOfTracks = tracks.length;
    if (numOfTracks === 0) {
      console.log("no tracks found");
      return;
    } else {
      tracks.forEach((element) => {
        popularitySum += element?.track?.popularity;
        if (element.track.explicit) {
          explicitCount += 1;
        }
      });
      setPopularityAverage(popularitySum / numOfTracks);
      setPercentExplicit((explicitCount / numOfTracks) * 100);
    }
  };

  useEffect(() => {
    const getPlaylistDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/playlistDetails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
            params: { playlistId: playlist_id },
          },
        );
        setPlaylistDetails(data.data);
        setTracks(data.data.tracks.items);
      } catch (error) {
        console.error(error);
      }
    };
    getPlaylistDetails();
  }, []);

  useEffect(() => {
    if (playlistDetails?.tracks?.items) {
      setTracks(playlistDetails.tracks.items);
    }
    if (playlistDetails.length !== 0) {
      getPopularityAverage();
    }
  }, [playlistDetails]);

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

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  return (
    <>
      <Box sx={{ flexGrow: 1, backgroundColor: "#ffcdb2" }}>
        <AppBar position="fixed" style={{ backgroundColor: "#e5989b" }}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              playlist analyzer
            </Typography>
            <Button
              href="/"
              float="right"
              variant="contained"
              style={{ backgroundColor: "#ffcdb2", fontWeight: "bold" }}
            >
              back to playlists
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Container style={{ marginTop: 80, backgroundColor: "#e5989b" }}>
        <Item elevation={0}>
          <Typography variant="h3">{playlistDetails.name}</Typography>
          <Typography variant="h5">
            created by{" "}
            <a
              href={`https://open.spotify.com/user/${playlistDetails.owner?.id}`}
              target="_blank"
            >
              {playlistDetails.owner?.display_name}
            </a>
          </Typography>
        </Item>
        <Item elevation={0}>
          {playlistDetails?.images && (
            <Box
              component="img"
              sx={{ height: 250 }}
              alt="playlist cover"
              src={playlistDetails.images[0].url}
            />
          )}
        </Item>
        <Item elevation={0}>
          <Typography>
            avg popularity score:{" "}
            {popularityAverage !== undefined
              ? popularityAverage.toFixed(2)
              : "error"}
          </Typography>
        </Item>
        <Item elevation={0}>
          <Typography>
            percent explicit:{" "}
            {percentExplicit !== undefined
              ? percentExplicit.toFixed(2)
              : "error"}
            %
          </Typography>
        </Item>
        <Item elevation={0}>
          <Typography variant="h4" sx={{ paddingTop: 4 }}>
            tracks in playlist
          </Typography>
          <TrackCards tracks={tracks} />
        </Item>
      </Container>
    </>
  );
}
