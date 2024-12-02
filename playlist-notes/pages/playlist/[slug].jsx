"use strict";

import axios from "axios";
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Stack,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Playlist() {
  const router = useRouter();
  const playlist_id = router.query.slug;
  const [token, setToken] = useState("");
  const [playlistDetails, setPlaylistDetails] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState({});
  const [popularityAverage, setPopularityAverage] = useState();
  const [percentExplicit, setPercentExplicit] = useState();

  const getPlaylistDetails = async () => {
    if (!playlist_id) {
      console.error("playlistId is undefined");
      return;
    } else if (!token) {
      console.error("missing auth token");
      return;
    }
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/playlists/${encodeURIComponent(
          playlist_id,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPlaylistDetails(data);
      setTracks(data.tracks.items);
    } catch (error) {
      console.error(error);
    }
  };

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

  const getAudioFeatures = async () => {
    try {
      if (!playlist_id) {
        console.error("missing track_ids");
        return;
      }
      if (!token) {
        console.error("missing auth token");
        return;
      }
      const { data } = await axios.get(
        `https://api.spotify.com/v1/audio-features/ids=${encodeURIComponent(
          tracks,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);
      setAudioFeatures(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token && playlist_id) {
      getPlaylistDetails(playlist_id);
    }
  }, [token, playlist_id]);

  useEffect(() => {
    if (playlistDetails?.tracks?.items) {
      setTracks(playlistDetails.tracks.items);
    }
  }, [playlistDetails]);

  useEffect(() => {
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
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              playlist analyzer
            </Typography>
            <Button href="/" float="right" variant="contained">
              back to playlists
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div style={{ marginTop: 80 }}>
        <Stack>
          <Item elevation={0}>
            {" "}
            <Typography variant="h3">{playlistDetails.name}</Typography>
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
              popularity score:{" "}
              {popularityAverage ? popularityAverage.toFixed(2) : "error"}
            </Typography>
          </Item>
          <Item elevation={0}>
            <Typography>
              percent explicit:{" "}
              {percentExplicit ? percentExplicit.toFixed(2) : "error"}%
            </Typography>
          </Item>
          {/* {tracks.map((element, index) => {
            return <Typography key={index}>{element.name}</Typography>;
          })} */}
        </Stack>
      </div>
    </>
  );
}
