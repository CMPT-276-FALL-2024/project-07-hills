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
    sanitized = re.sub(r'[<>:"/\\|?*\[\],]', '', ascii_only).strip()

    # Replace multiple spaces or underscores with a single underscore
    sanitized = re.sub(r'\s+', '_', sanitized)

    return sanitized


# Song object
class Song(BaseModel):
    title: str
    artist: str
    # img_url: str
    spotify_url: str
    original_path: str
    instrumental_URL: str
    duration: str
    lyrics: Lyrics  # The Lyrics object without syncType

    @classmethod
    def create_from_track(cls, track: dict, lyrics) -> "Song":
        # title = track["name"]
        # artist = ", ".join([artist["name"] for artist in track["artists"]])  # Join multiple artists
        title = sanitize_filename(track["name"])  # Sanitize title
        artist = sanitize_filename(", ".join([artist["name"] for artist in track["artists"]]))  # Sanitize artist

        spotify_url = track["external_urls"]["spotify"]
        original_path = ""
        instrumental_URL = ""
        duration = f"{track['duration_ms'] // 60000}:{(track['duration_ms'] // 1000) % 60:02}"  # Convert ms to mm:ss
        lyrics = lyrics

        return cls(
            title=title,
            artist=artist,
            spotify_url=spotify_url,
            instrumental_URL="",  # Default empty paths
            original_path="",
            duration=duration,
            lyrics=lyrics,
        )

    def sanitize_filename(filename: str) -> str:
        """
        Sanitize the filename by removing characters that are not allowed in file names.
        """
        # Regex pattern to allow only alphanumeric characters, spaces, dashes, underscores, and periods
        return re.sub(r'[<>:"/\\|?*\[\]]', '', filename).strip()

    def download_original(self):
        output_folder = "./downloads"
        # Delete the stars if it contains them

        inferred_path = f"{output_folder}/{self.artist} - {self.title}.mp3"
        print(self.title)

        if os.path.exists(inferred_path):
            print(f"File already downloaded: {inferred_path}")
            return inferred_path

        # CLI command
        command = [
            "spotdl",
            self.spotify_url,
            "--output",
            output_folder,
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

                    file_path = f"./downloads/{artist} - {title}.mp3"
                    return file_path

            print("Could not infer the file path from SpotDL's output.")
            return None
        except subprocess.CalledProcessError as e:
            print(f"Error downloading song: {e}")
            return None

    def get_audio(self):
        self.original_path = self.download_original()
        # This should be move to 40% -- slow speed to 80%
        instrumental_filename = separate_audio(self.original_path)
        # this should be 100%

        # Encode the file name to make it URL-safe
        encoded_file_name = quote(instrumental_filename)
        # change file_name to URL name
        self.instrumental_URL = f"http://localhost:8000/static/{encoded_file_name}"
