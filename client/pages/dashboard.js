import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [codeVerifier, setCodeVerifier] = useState(null);

  useEffect(() => {
    // Fetch code_verifier from localStorage on mount
    const verifier = window.localStorage.getItem("code_verifier");
    setCodeVerifier(verifier);
  }, []); // Empty dependency array to ensure this runs only once

  useEffect(() => {
    const getCallback = async () => {
      if (!code || !codeVerifier) {
        console.log(code + " " + codeVerifier);
        console.error("Missing code or code_verifier.");
        return;
      }

      let params = {
        code: code,
        state: state,
        code_verifier: codeVerifier,
      };

      try {
        const response = await axios.get("http://localhost:8080/callback", {
          params: { code, code_verifier: codeVerifier },
          withCredentials: true,
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    };

    getCallback();
  }, [code, codeVerifier]); // Dependencies ensure it runs when code or codeVerifier changes

  return <div>Processing authentication...</div>;
};

export default Dashboard;
