import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv
import os
from syrics.api import Spotify
import json

# Load environment variables
load_dotenv("python.env")

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")
sp_cookie = os.getenv("SPOTIFY_COOKIE")

# Set up authentication
client_credentials_manager = SpotifyClientCredentials(
    client_id=client_id,
    client_secret=client_secret
)
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
syrics_sp = Spotify(sp_cookie)

# Search for a track
track_name = "creep"
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

    # Retrieve the artist name(s) and join them if there are multiple artists
    artist_name = ', '.join(artist['name'] for artist in track['artists'])

    # Retrieve the song's duration (in milliseconds)
    duration_ms = track['duration_ms']
    
    # Convert milliseconds to minutes and seconds
    duration_min = duration_ms // 60000
    duration_sec = (duration_ms % 60000) // 1000
    song_duration = f"{duration_min}m {duration_sec}s"
    
    lyrics_data = {
        "title": track["name"], 
        "artist": artist_name, 
        "instrumental_url": "../client/src/Creep - Radiohead (Lyrics).mp3",
        "duration": song_duration,
        "lyrics": lyrics["lyrics"]
    }

    # Define the full path to save the file
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    save_path = os.path.join(repo_root, 'src', 'client', 'src', 'sample.json')

    # Ensure the directory exists
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    # Write to the JSON file
    with open(save_path, 'w') as file:
        json.dump(lyrics_data, file, indent=4)
    
    print(f"Data saved to {save_path}")
else:
    print("No tracks found.")