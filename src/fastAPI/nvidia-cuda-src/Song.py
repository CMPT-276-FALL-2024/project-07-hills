import unicodedata

from pydantic import BaseModel
from typing import List, Optional
from syrics.api import Spotify
import dlp as dlp
import yt_dlp
from ytdl import get_audio
from uvr import separate_audio
from genius import get_genius_lyrics
import subprocess
import os
from urllib.parse import quote
import re


# Structure of a single line
class Line(BaseModel):
    startTimeMs: str
    words: str
    syllables: Optional[List[str]] = []  # Default to an empty list
    endTimeMs: str


# Structure of Lyrics object
class Lyrics(BaseModel):
    lines: List[Line]  # A list of Line objects


def sanitize_filename(filename: str) -> str:
    """
      Sanitize the filename by:
      - Removing illegal characters (e.g., < > : " / \ | ? * [ ])
      - Stripping leading/trailing whitespace
      - Removing or replacing Unicode characters
      """
    # Normalize Unicode characters to remove accents and diacritics
    normalized = unicodedata.normalize('NFKD', filename)
    ascii_only = normalized.encode('ascii', 'ignore').decode('ascii')

    # Remove illegal characters
    sanitized = re.sub(r'[<>:"/\\|?*\[\]]', '', ascii_only).strip()

    # Replace multiple spaces or underscores with a single white space
    sanitized = re.sub(r'\s+', ' ', sanitized)

    return sanitized


# Song object
class Song(BaseModel):
    title: str
    artist: str
    # img_url: str
    spotify_url: str
    spotify_id: str
    album_image_URL: str
    original_path: str
    instrumental_URL: str
    duration: str

    lyrics: Optional[Lyrics]
    has_instrumental_audio: bool = False

    @classmethod
    def create_from_track(cls, track: dict, lyrics) -> "Song":
        title = sanitize_filename(track["name"])  # Sanitize title
        artist = sanitize_filename(track["artists"][0]["name"])  # Get and sanitize only the first artist's name

        spotify_url = track["external_urls"]["spotify"]
        spotify_id = track["id"]
        album_image_URL = track["album"]["images"][0]['url']
        duration = f"{track['duration_ms'] // 60000}m {(track['duration_ms'] // 1000) % 60}s"
        lyrics = lyrics

        return cls(
            title=title,
            artist=artist,
            spotify_url=spotify_url,
            spotify_id=spotify_id,
            album_image_URL=album_image_URL,
            instrumental_URL="",
            original_path="",
            duration=duration,
            lyrics=lyrics,
            has_instrumental_audio=False,
        )

    def download_original(self):
        output_folder = "./downloads"

        inferred_path = f"{output_folder}/{self.artist} - {self.title}.mp3"

        print(inferred_path)
        if os.path.exists(inferred_path):
            print(f"File already downloaded: {inferred_path}")
            return inferred_path

        sanitized_artist = self.artist
        sanitized_title = self.title
        output_path = os.path.join(output_folder, f"{sanitized_title} - {sanitized_artist}.mp3")

        # CLI command
        command = [
            "spotdl",
            self.spotify_url,
            "--output",
            f"{output_folder}/{{artist}} - {{title}}"  # SpotDL will replace placeholders with actual values
        ]
        
        try:
            print("Downloading...")
            # this should be about 20%
            result = subprocess.run(command, capture_output=True, text=True, check=True)
            print("SpotDL Output:", result.stdout)  # Print SpotDLs output for debugging
            for line in result.stdout.splitlines():
                if "Downloaded" in line:
                    # Parse line to extract artist and title
                    downloaded_info = line.split('"')[1]
                    artist, title = downloaded_info.split(" - ", 1)  # Split artist and title

                    file_path = f"./downloads/{self.artist} - {self.title}.mp3"
                    print(file_path)
                    return file_path

            print("Could not infer the file path from SpotDL's output.")
            return None
        except subprocess.CalledProcessError as e:
            print(f"Error downloading song: {e}")
            return None

    def download_audio(self):
        self.original_path = self.download_original()

    def get_instrumental(self):
        instrumental_filename = separate_audio(self.original_path)
        encoded_file_name = quote(instrumental_filename)
        self.instrumental_URL = f"https://vocafree.ngrok.app/static/{encoded_file_name}"
        self.has_instrumental_audio = True  # Update the flag

    def get_audio(self):
        self.original_path = self.download_original()
        # This should be move to 40% -- slow speed to 80%
        instrumental_filename = separate_audio(self.original_path)
        # this should be 100%

        # Encode the file name to make it URL-safe
        encoded_file_name = quote(instrumental_filename)
        # change file_name to URL name
        self.instrumental_URL = f"https://vocafree.ngrok.app/static/{encoded_file_name}"
        self.has_instrumental_audio = True  # Update the flag
