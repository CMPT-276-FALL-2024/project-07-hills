import dlp as dlp
import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from datetime import datetime
import glob

DOWNLOADS_FOLDER = "./downloads"

def test_get_audio(link):
    # logger.info(f"Processing youtube link: {link}")
    youtube_downloader_options = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'ffmpeg_location': '/opt/homebrew/bin/ffmpeg',  # Replace with the actual path to ffmpeg NOTE: MAKE SURE THIS LEADS TO YOUR ffmpeg -- use which ffmpeg or add ffmpeg to src path
    'outtmpl': 'downloads/%(title)s.%(ext)s'
}

    with yt_dlp.YoutubeDL(youtube_downloader_options) as ydl:
        info = ydl.extract_info(link, download=True)
        original_filename = ydl.prepare_filename(info).rsplit(".", 1)[0] + ".mp3"
        youtube_title = os.path.basename(original_filename)

        # Extract track information
        song_name = info.get("track", "Unknown Title")
        artist = info.get("artist", "Unknown Artist")
        print("Song Name:", song_name, "Artist:", artist)

        # Find the instrumental file
        instrumental_files = glob.glob(
            os.path.join(DOWNLOADS_FOLDER, f"*{youtube_title.rsplit('.', 1)[0]}*Instrumental*.mp3"))
        if not instrumental_files:
            raise HTTPException(status_code=404, detail="Instrumental file not found")
        instrumental_file = instrumental_files[0]

        # Remove the original MP3 if it exists
        if os.path.exists(original_filename):
            os.remove(original_filename)

        # Rename the vocal-removed file to match the original YouTube title
        new_filename = os.path.join(DOWNLOADS_FOLDER, youtube_title)
        os.rename(instrumental_file, new_filename)

        file_url = f"/downloads/{youtube_title}"
    
import yt_dlp
import os

async def get_audio(link: str):
    youtube_downloader_options = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'ffmpeg_location': '/opt/homebrew/bin/ffmpeg',  # Update this path if needed
        'outtmpl': 'downloads/%(title)s.%(ext)s'
    }

    with yt_dlp.YoutubeDL(youtube_downloader_options) as ydl:
        info = ydl.extract_info(link, download=True)
        original_filename = ydl.prepare_filename(info).rsplit(".", 1)[0] + ".mp3"
        youtube_title = os.path.basename(original_filename)

        # Extract track information
        song_name = info.get("track", "Unknown Title")
        artist = info.get("artist", "Unknown Artist")
        print("Song Name:", song_name, "Artist:", artist)

        # Return the extracted data as JSON
        return {
            "file_path": original_filename,
            "title": youtube_title,
            "song_name": song_name,
            "artist": artist
        }
    
    pass
