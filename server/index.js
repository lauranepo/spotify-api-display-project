import "dotenv/config";
import express from 'express'
import cors from 'cors';
import querystring from 'querystring';
import crypto from "node:crypto";
import axios from "axios";
import session from "express-session";

const PORT = process.env.SERVER_PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

// Set up session management
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
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
    }, 
    credentials: true,
  } ));

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

function sha256(plain) { 
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

// Update getToken function
const getToken = async (code, codeVerifier) => {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 
            querystring.stringify({
                client_id: CLIENT_ID,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                code_verifier: codeVerifier
            }), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error(error, "error getting token");
    }
};

app.get('/user', (req, res) => {
    const user = req.session?.user;
    if (user) {
        res.send({ user: true });
    } else {
        res.send({ user: false });
    }
});

app.get('/login', async (req, res) => {
    const state = generateRandomString(16);
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64urlencode(hashed);
    const scope = "playlist-read-private playlist-read-collaborative user-read-private user-read-email";

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

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send({ message: "logged out" });
});

// Get access token from auth
app.get('/callback', async (req, res) => {
    let code = req.query?.code;
    let codeVerifier = req.query?.code_verifier;
    
    if (!code || !codeVerifier) {
        res.status(401)
        res.send({"error": "no code or code verifier"});
        return;
    }
    if (req.session?.user?.accessToken) {
        res.send({"message": "already authenticated"});
        return;
    }
    let sessionData = await getToken(code, codeVerifier);
    if (sessionData?.access_token === undefined) {
        return;
    }
    req.session.user = {
        accessToken: sessionData.access_token,
        tokenType: sessionData.token_type,
        expiresIn: sessionData.expires_in,
        refreshToken: sessionData.refresh_token,
        scope: sessionData.scope
    };
    req.session.code = code;
    console.log(req.session.user);
    res.setHeader('Content-Type', 'application/json');
    res.send({"message": "successful callback"});
});

app.get('/playlists', async (req, res) => {
    let accessToken = req.session.user?.accessToken;
    if (accessToken === undefined) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }
    await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    }).then((response) => {
        res.send({data: response.data});
    }).catch((error) => {
        console.error("error getting playlists", error);
    });  
})

app.get('/playlistDetails', async (req, res) => {
    let accessToken = req.session.user?.accessToken;
    let playlistId = req.query.playlistId;
    await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    }).then((response) => {
        res.send({data: response.data});
    }).catch((error) => {
        console.error("error getting playlist details", error);
    }); 
})

app.get('/refreshToken', function (req, res) {
    var refreshToken = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        },
        json: true
    };

    req.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var accessToken = body.access_token,
                refreshToken = body.refreshToken || refreshToken;
            res.send({
                'access_token': accessToken,
                'refresh_token': refreshToken
            });
        }
    });
});


app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})