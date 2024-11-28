import { Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function Playlist() {
    const router = useRouter();
    return <Typography>playlist id: {router.query.slug}</Typography>
}