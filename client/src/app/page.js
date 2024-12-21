"use client";
"use strict";

import { useState, useEffect } from "react";
import axios from "axios";
import SimpleAppBar from "./components/SimpleAppBar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await axios.get("http://localhost:8080/user", {
          withCredentials: true,
        }).then((response) => {
          if (response.data.user) {
            router.push("/dashboard");
            return;
          }});
      } catch (error) {
        console.error(error);
      }
    };
    checkAuthentication();
  }, []);

  return (
    <>
      <SimpleAppBar />
    </>
  );
}
