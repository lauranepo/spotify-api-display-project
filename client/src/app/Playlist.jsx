import { Card, CardContent, CardMedia, Typography, Grid, CardActionArea } from "@mui/material";

const Playlist = ({ playlist }) => {
    return (
        <Grid container spacing={2}>
            <Grid item key={index} columnSpacing={{ xs: 4, sm: 6, md: 8 }}>
                <CardActionArea>
                    <Card
                        sx={{ height: 300, width: 200 }}
                        variant="outlined"
                    >
                        <CardMedia
                            component="image"
                            sx={{ height: 200  }}
                            image={playlist.images[0].url}
                            title="playlist art"
                        />
                        <CardContent>
                            <Typography>
                                {playlist.name}
                            </Typography>
                        </CardContent>
                    </Card>
                </CardActionArea>
            </Grid>
        </Grid>
    )
}

export default Playlist;