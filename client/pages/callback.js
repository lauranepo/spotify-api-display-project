import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const Callback = () => {
  // const router = useRouter();
  // router.push("/");
  const searchParams = useSearchParams();
  // axios.get("http://localhost:8080/callback");
  const code = searchParams.get("code");

  return <div>Processing authentication...</div>;
};

export default Callback;
