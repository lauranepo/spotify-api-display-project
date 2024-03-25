import { CardContent, Card, Typography, Grid } from "@mui/material";

const PlaylistCards = ({ playlists }) => {
    return (
        <Grid container spacing={2}>
            {playlists.map((playlist, index) => (
                <Grid item key={index} columnSpacing={{ xs: 4, sm: 6, md: 8 }}>
                    <Card
                        sx={{ minWidth: 275, maxWidth: 275, minHeight: 150 }}
                        variant="outlined"
                    >
                        <CardContent>
                            <Typography>
                                {playlist}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export default PlaylistCards;