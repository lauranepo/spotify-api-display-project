import "dotenv/config";
import express from 'express'
import cors from 'cors';
import querystring from 'querystring';
import crypto from "node:crypto";
import fetch from "node-fetch";

const PORT = process.env.SERVER_PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

const app = express();
app.use(cors());

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const getToken = async (code) => {
    let codeVerifier = localStorage.getItem('code_verifier');

    const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
      }

      const body = await fetch(url, payload);
      const response = await body.json();

      localStorage.setItem('access_token', response.access_token);
}

app.get('/login', async (req, res) => {
    const state = generateRandomString(16);
    const codeVerifier  = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);
    const scope = "playlist-read-private playlist-read-collaborative";

    const params = {
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
    }

    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify(params);
    res.json({ url: spotifyAuthUrl, code_verifier: codeVerifier });
});

// Get access token from auth
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
      
              var code = body.code;
                console.log("requesting playlists");
              var options = {
                url: 'https://api.spotify.com/v1/me/playlists',
                headers: { 'Authorization': 'Bearer ' + code },
                json: true
              };
      
              // use the access token to access the Spotify Web API
              request.get(options, function(error, response, body) {
                console.log(body);
              });
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
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + client_secret).toString('base64'))
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