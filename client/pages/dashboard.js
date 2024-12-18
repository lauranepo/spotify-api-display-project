import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import PlaylistCards from "@/app/components/PlaylistCards";

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(null);
  const state = searchParams.get("state");
  const [codeVerifier, setCodeVerifier] = useState(null);
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const verifier = window.localStorage.getItem("code_verifier");
    console.log(verifier);
    if (verifier !== null) {
      setCodeVerifier(verifier);
    }
    if (code === null) {
      let urlCode = searchParams.get("code");
      console.log(urlCode);
      if (urlCode !== null) {
        setCode(urlCode);
      }
    }
  }, []);

  useEffect(() => {
    if (codeVerifier === null) {
      setCallback(false);
    }
  }, [codeVerifier]);

  useEffect(() => console.log(profile), [profile]);

  useEffect(() => {
    console.log(callback);
    const getCallback = async () => {
      console.log(window.location.href);
      let paramCode = searchParams.get("code");
      let paramCodeVerifier = window.localStorage.getItem("code_verifier");
      console.log(paramCode + " " + paramCodeVerifier);
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
    if (!callback && codeVerifier) {
      getCallback();
    }
  }, [callback]);

  useEffect(() => {
    if (callback) {
      const getProfile = async () => {
        await axios
          .get("http://localhost:8080/profile", { withCredentials: true })
          .then((res) => {
            setProfile(res.data.data);
          });
      };
      if (callback) {
        getProfile();
      }
    }
  }, [callback]);

  return (
    <div>
      {/* <PlaylistCards playlists={playlists}/> */}
      <div>name: {profile?.display_name}</div>
    </div>
  );
};

export default Dashboard;
