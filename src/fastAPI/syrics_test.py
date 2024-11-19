from syrics.api import Spotify
import json

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv
import os
import json

from spotdl import Spotdl
import subprocess

# lyrics = sp.get_lyrics("3GCL1PydwsLodcpv0Ll1ch")

# print(json.dumps(lyrics['lyrics']['lines'], indent=4))


# Define the Spotify track URL and output folder
spotify_url = "https://open.spotify.com/track/70LcF31zb1H0PyJoS1Sx1r"
output_folder = "./downloads/{artist} - {title}.mp3"

# Construct the SpotDL CLI command
command = [
    "spotdl",
    spotify_url,
    "--output",
    output_folder
]

# Run the command
try:
    result = subprocess.run(command, capture_output=True, text=True, check=True)
    print("SpotDL Output:", result.stdout)  # Print SpotDL's output for debugging
        # Extract track title and artist from SpotDL's output
        
    for line in result.stdout.splitlines():
        if "Downloaded" in line:
            # Parse the line to extract artist and title
            downloaded_info = line.split('"')[1]  # Extract "Artist - Title" part
            artist, title = downloaded_info.split(" - ", 1)  # Split artist and title
            
            # Infer the file path
            inferred_path = f"./downloads/{artist} - {title}.mp3"
            print(f"Inferred File Path: {inferred_path}")
            break
    else:
        print("Could not infer the file path from SpotDL's output.")
        
    print("Song downloaded successfully!")
    
    
except subprocess.CalledProcessError as e:
    print(f"Error downloading song: {e}")

