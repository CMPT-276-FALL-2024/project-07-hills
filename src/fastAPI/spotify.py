import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv
import os
from syrics.api import Spotify
import json
from spotdl import Spotdl
from Song import Lyrics

class SpotifyDIY:
    def __init__(self, env_file="python.env"):
        #Load environment variables
        load_dotenv("python.env")
        self.client_id = os.getenv("CLIENT_ID")
        self.client_secret = os.getenv("CLIENT_SECRET")
        self.sp_cookie = os.getenv("SPOTIFY_COOKIE")
        if not all([self.client_id, self.client_secret, self.sp_cookie]):
            raise ValueError("Environment variables CLIENT_ID, CLIENT_SECRET, or SPOTIFY_COOKIE are missing")
        
        #setup spotify client
        client_credentials_manager = SpotifyClientCredentials(client_id=self.client_id, client_secret=self.client_secret)
        self.spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

        # Set up syrics
        self.syrics = Spotify(self.sp_cookie)
        
        # Set up SpotDL for downloading
        self.spotdl = Spotdl(client_id=self.client_id, client_secret=self.client_secret)
    
    def get_tracks(self, track_name, limit=6):
        print("gigitytrack")
        results = self.spotify.search(q=track_name, type="track", limit=limit)
        print("gigity results")
        if results["tracks"]["items"]:
            return results["tracks"]["items"]
        else:
            raise ValueError(f"No tracks found for '{track_name}'")
        
    def get_single_track(self, track_name, limit=1):
        results = self.spotify.search(q=track_name, type="track", limit=limit)
        if results["tracks"]["items"]:
            return results["tracks"]["items"][0]
        else:
            raise ValueError(f"No tracks found for '{track_name}'")
    
    def get_single_track_by_id(self, track_id):
        try:
            track = self.spotify.track(track_id)  # Fetch track details by ID
            return track
        except Exception as e:
            raise ValueError(f"Failed to retrieve track details for ID '{track_id}': {e}")
    
    def get_lyrics_from_track(self, track):
        """
        Retrieve lyrics for a Spotify track using the Syrics API.
        Args:
            track_id (str): Spotify track ID.
        Returns:
            Lyrics: A Lyrics object containing lines of the lyrics.
        """
        lyrics_data = self.syrics.get_lyrics(track["id"])
        if lyrics_data is None:
            return None
        return Lyrics(lines=lyrics_data["lyrics"]["lines"])
    
    def get_lyrics_from_id(self, id):
        lyrics_data = self.syrics.get_lyrics(id)
        if lyrics_data is None:
            return None
        return Lyrics(lines=lyrics_data["lyrics"]["lines"])
    
