import "dotenv/config";
import express from 'express'
import cors from 'cors';
import fetch from 'node-fetch';
import querystring from 'querystring';
import { getRandomValues } from "node:crypto";

const PORT = process.env.SERVER_PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

const app = express();

app.use(cors());

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

app.get('/login', (req, res) => {
    var state = generateRandomString(16);
    var scope = "playlist-read-private playlist-read-collaborative";
    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state
        });
    res.json({ url: spotifyAuthUrl });
});

app.get('/callback', function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
      
              var access_token = body.access_token,
                  refresh_token = body.refresh_token;
      
              var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
              };
      
              // use the access token to access the Spotify Web API
              request.get(options, function(error, response, body) {
                console.log(body);
              });
      
              // we can also pass the token to the browser to make requests from there
              res.redirect('/#' +
                querystring.stringify({
                  access_token: access_token,
                  refresh_token: refresh_token
                }));
            } else {
              res.redirect('/#' +
                querystring.stringify({
                  error: 'invalid_token'
                }));
            }
          });
        }
    }
);

app.get('/refresh_token', function (req, res) {

    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token,
                refresh_token = body.refresh_token || refresh_token;
            res.send({
                'access_token': access_token,
                'refresh_token': refresh_token
            });
        }
    });
});

// app.get('/', async (req, res) => {
//     try {
//         const { playlistId } = req.params['playlistId'];
//         const apiResponse = await fetch(
//             `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
//         );
//         const apiResponseJson = await apiResponse.json();
//         res.send(apiResponseJson);
//     } catch (err) {
//         res.status(500).send('Something went wrong');
//     }
// });


app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})