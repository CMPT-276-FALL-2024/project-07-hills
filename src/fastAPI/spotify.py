import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from dotenv import load_dotenv
import os

from syrics.api import Spotify
import json

load_dotenv("python.env")

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")
sp_cookie = os.getenv("SPOTIFY_COOKIE")

# Set up authentication
client_credentials_manager = SpotifyClientCredentials(
    client_id= client_id,
    client_secret= client_secret
)
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
syrics_sp = Spotify(sp_cookie)

# Search for a track
track_name = "Creep"
results = spotify.search(q=track_name, type="track", limit=1)

# Print track details
if results["tracks"]["items"]:
    track = results["tracks"]["items"][0]
    print(f"Track Name: {track['name']}")
    print(f"Artist: {', '.join(artist['name'] for artist in track['artists'])}")
    print(f"Album: {track['album']['name']}")
    print(f"Spotify URL: {track['external_urls']['spotify']}")
    print(f"Track ID: {track['id']}")
    
    track_id = track['id']
    lyrics = syrics_sp.get_lyrics(track_id)
    
    print(f"Lyrics")
    
    
    lyrics_data = {
        "title": "Creep",   
        "artist": "Radiohead",
        "instrumental_url": "../client/src/Creep - Radiohead (Lyrics).mp3",
        "lyrics": lyrics["lyrics"]
    }
    file_name = 'sample.json'
    with open(file_name, 'w') as file:
        json.dump(lyrics_data, file, indent=4)

    
else:
    print("No tracks found.")





