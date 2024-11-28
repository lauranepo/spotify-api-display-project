import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CardActionArea,
} from "@mui/material";
import Link from "next/link";

const PlaylistCards = ({ playlists }) => {
  if (playlists === null || playlists.length === 0) {
    return <Typography>no playlists</Typography>;
  } else {
    return (
      <Grid container spacing={2}>
        {playlists.map((playlist, index) => {
          if (playlist === null) return;
          return (
            <Grid item key={index} columnSpacing={{ xs: 4, sm: 6, md: 8 }}>
              <CardActionArea>
                <Link href={`/playlist/${playlist.id}`} />
                <Card sx={{ height: 300, width: 200 }} variant="outlined">
                  <CardMedia
                    component="image"
                    sx={{ height: 200 }}
                    image={playlist?.images[0]?.url}
                    title="playlist art"
                  />
                  <CardContent>
                    <Typography>{playlist.name}</Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
          );
        })}
      </Grid>
    );
  }
};

export default PlaylistCards;
