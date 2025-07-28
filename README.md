# README.md

last updated 01/03/2025

## What is this?

This is a project to implement a Next.js frontend with a simple Express backend. I mostly wanted to practice developing a web application that utilized session management to store sensitive data, such as the generated access token from Spotify. The access token is retrieved using a Proof Key for Code Exchange (PKCE) authorization flow.

The website allows users to log in to their Spotify accounts, and then grant permissions so that the server can get access to playlists. Each playlist page contains creator information, fun stats about the playlist, and a visual list of tracks. Each track includes a link to the respective track.

## Progress tracking

### To-do

- Update styles
- Implement refresh token call

### Done so far

- PKCE authorization for access token
- Using express-session to manage user sessions
- Playlists and slug page for playlists are rendering
- Implement back to playlists functionality (return to dashboard within session)
- Switch fetch calls in server to axios for consistency
