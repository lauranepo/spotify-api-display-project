import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CardActionArea,
} from "@mui/material";
import Link from "next/link";

const TrackCards = ({ tracks }) => {
  if (tracks === null || tracks.length === 0) {
    return <Typography>no tracks</Typography>;
  } else {
    return (
      <Grid
        container
        spacing={3}
        direction="row"
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        {tracks.map((track, index) => {
          if (track === null) return;
          return (
            <Grid item key={index} columnSpacing={{ xs: 4, sm: 6, md: 8 }}>
              <CardActionArea>
                <Link
                  href={`https://open.spotify.com/track/${track.track.id}`}
                  target="_blank"
                >
                  <Card
                    sx={{
                      paddingBottom: 5,
                      maxHeight: 300,
                      width: 250,
                    }}
                    variant="outlined"
                  >
                    <CardMedia
                      component="image"
                      sx={{ height: 250 }}
                      image={track.track.album.images[0]?.url}
                      title="track art"
                    />
                    <CardContent sx={{ overflow: "hidden" }}>
                      <Typography>{track.track.name}</Typography>
                      <Typography marginBottom={5}>
                        {track.track.artists[0]?.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </CardActionArea>
            </Grid>
          );
        })}
      </Grid>
    );
  }
};

export default TrackCards;
