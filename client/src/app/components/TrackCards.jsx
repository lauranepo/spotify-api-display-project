import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CardActionArea,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";

const TrackCards = ({ tracks }) => {
  if (tracks === null || tracks.length === 0) {
    return <Typography>no tracks</Typography>;
  } else {
    return (
      <Box sx={{ padding: 10, maxWidth: 1000 }}>
        <Masonry columns={4} spacing={2}>
          {tracks.map((track, index) => {
            if (track === null) return;
            return (
              <Card
                sx={{
                  maxWidth: 200,
                }}
                variant="outlined"
                key={index}
              >
                <CardActionArea
                  href={`https://open.spotify.com/track/${track.track.id}`}
                  target="_blank"
                >
                  <CardMedia
                    component="image"
                    sx={{ height: 200, width: 200 }}
                    image={track.track.album.images[0]?.url}
                    title="track art"
                  />
                  <CardContent
                    sx={{ padding: 5, paddingTop: 2, paddingBottom: 2 }}
                  >
                    <Typography variant="h6">{track.track.name}</Typography>
                    <Typography>{track.track.artists[0]?.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Masonry>
      </Box>
    );
  }
};

export default TrackCards;
