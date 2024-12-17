import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import PlaylistCards from "@/app/components/PlaylistCards";

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [codeVerifier, setCodeVerifier] = useState(null);
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const verifier = window.localStorage.getItem("code_verifier");
      setCodeVerifier(verifier);
      await axios
        .get("http://localhost:8080/profile", { withCredentials: true })
        .then((res) => {
          setProfile(res);
        });
    };
    getProfile();
  }, []);

  // useEffect(() => {
  //   console.log(profile);
  // }, [profile]);

  useEffect(() => {
    const getCallback = async () => {
      try {
        const response = await axios.get("http://localhost:8080/callback", {
          params: { code, code_verifier: codeVerifier },
          withCredentials: true,
        });
        console.log(response.data);
        setCallback(true);
      } catch (error) {
        console.error("Error during authentication:", error);
        setCallback(false);
      }
    };
    getCallback();
  }, [code, codeVerifier]); // Dependencies ensure it runs when code or codeVerifier changes

  return (
    <div>
      {/* <PlaylistCards playlists={playlists}/> */}
      <div>profile</div>
    </div>
  );
};

export default Dashboard;
