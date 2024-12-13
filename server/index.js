import "dotenv/config";
import express from 'express'
import cors from 'cors';
import querystring from 'querystring';
import crypto from "node:crypto";
import fetch from "node-fetch";
import session from "express-session";
import { access } from "node:fs";

const PORT = process.env.SERVER_PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_KEY = process.env.SECRET_KEY;
const REDIRECT_URI = process.env.REDIRECT_URI;

const app = express();

// Set up session management
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    genid: function() {
        return crypto.randomUUID();
      },
    cookie: { maxAge: 60000 }
}));

// Configure CORS
const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000']
app.use(cors({
    origin: function(origin, callback){ 
      if(!origin) return callback(null, true);    
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }    
      return callback(null, true);
    }, credentials: true
  } ));

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

function sha256(plain) { 
    // returns promise ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

const getToken = async (code, codeVerifier) => {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
    })
    const body = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
    });
    const response = await body.json();
    return response;
}

app.get('/login', async (req, res) => {
    const state = generateRandomString(16);
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64urlencode(hashed);
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

app.get('/check-session', (req, res) => {
    res.json({ user: req.session.user || 'No user session found' });
});

// Get access token from auth
app.get('/callback', async (req, res) => {
    let code = req.query.code || null;
    let code_verifier = req.query.code_verifier || null;
    let session_data = await getToken(code, code_verifier);
    if (session_data === undefined) {
        return;    
    }
    req.session.user = {
        access_token: session_data.access_token,
        token_type: session_data.token_type, 
        expires_in: session_data.expires_in,
        refresh_token: session_data.refresh_token, 
        scope: session_data.scope 
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


app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})