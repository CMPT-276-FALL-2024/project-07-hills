from pydantic import BaseModel
from typing import List, Optional
from syrics.api import Spotify
import dlp as dlp
import yt_dlp
from ytdl import get_audio
from uvr import separate_audio
from genius import get_genius_lyrics
import subprocess

# Structure of a single line
class Line(BaseModel):
    startTimeMs: str
    words: str
    syllables: Optional[List[str]] = []  # Default to an empty list
    endTimeMs: str

# Structure of Lyrics object
class Lyrics(BaseModel):
    lines: List[Line]  # A list of Line objects

# Song object
class Song(BaseModel):
    title: str
    artist: str
    spotify_url: str
    instrumental_path: str
    original_path: str
    duration: str
    lyrics: Lyrics  # The Lyrics object without syncType
    
    def download_original(self):
        output_folder = "./downloads/{artist} - {title}.mp3"
        
        # CLI command
        command = [
            "spotdl",
            self.spotify_url,
            "--output",
            output_folder,
            
        ]
        
        try:
            result = subprocess.run(command, capture_output=True, text=True, check=True)
            print("SpotDL Output:", result.stdout) #Print SpotDLs output for debugging
            for line in result.stdout.splitlines():
                if "Downloaded" in line:
                    #Parse line to extract artist and title
                    downloaded_info = line.split('"')[1]
                    artist, title = downloaded_info.split(" - ", 1) #Split artist and title
                    
                    file_path = f"./downloads/{artist} - {title}.mp3"
                    return file_path
                
            print("Could not infer the file path from SpotDL's output.")
            return None   
        except subprocess.CalledProcessError as e:
            print(f"Error downloading song: {e}")
            return None
    
    def get_audio(self):
        self.original_path = self.download_original()
        self.instrumental_path = separate_audio(self.original_path)
        
    
    def set_duration(track):
        
        
# Create a Song object
song = Song(
    title="Example Song",
    artist="Example Artist",
    spotify_url="https://open.spotify.com/track/70LcF31zb1H0PyJoS1Sx1r",
    instrumental_path="",
    original_path="",
    duration="",
    lyrics=Lyrics(lines=[])  # Provide an empty Lyrics object
)

print(song.download_original())