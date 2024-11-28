import axios from "axios";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Playlist() {
  const router = useRouter();
  const playlist_id = router.query.slug;
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState({});

  const getPlaylistTracks = async (playlist_id) => {
    if (!playlist_id) {
      console.error("playlist_id is undefined");
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
      if (data.tracks === undefined) {
        console.error("data.tracks is undefined");
        return;
      }
      let trackIds = data.tracks.items.map((element) => {
        return element.track.id;
      });
      setTracks(trackIds);
    } catch (error) {
      console.error(error);
    }
  };

  const getAudioFeatures = async () => {
    try {
      if (!tracks || tracks.length === 0) {
        console.error("missing track_ids");
        return;
      }
      if (!token) {
        console.error("missing auth token");
        return;
      }
      let trackIdsString = "";
      // tracks.forEach((element, index) => {
      //   if (index === 0) {
      //     trackIdsString = element;
      //   } else {
      //     trackIdsString = trackIdsString + "%" + element;
      //   }
      // });
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
      getPlaylistTracks(playlist_id);
    }
  }, [token, playlist_id]);

  useEffect(() => {
    console.log(audioFeatures);
  }, [audioFeatures]);

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
    console.log("playlist_id  " + playlist_id);
    setToken(token);
  }, []);

  useEffect(() => {
    console.log("track ids: " + tracks);
    getAudioFeatures();
  }, [tracks]);

  return (
    <>
      <Button href="/" color="secondary" variant="contained" size="medium">
        Go Back
      </Button>
      <Typography>playlist id: {playlist_id}</Typography>
    </>
  );
}
