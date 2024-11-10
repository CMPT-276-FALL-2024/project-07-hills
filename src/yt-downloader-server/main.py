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

# Create a folder for logs if it doesn't exist
LOGS_FOLDER = "./logs"
os.makedirs(LOGS_FOLDER, exist_ok=True)

# Get the current date and time to use in the log filename
current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
log_filename = os.path.join(LOGS_FOLDER, f"{current_time}.txt")

# Configure logging to write to the file with the current date and time as the name
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(log_filename),  # File to save logs to
        logging.StreamHandler()  # Also prints logs to the console
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


class YouTubeLink(BaseModel):
    youtubeLink: str


DOWNLOADS_FOLDER = "./downloads"

@app.post("/submit-link")
# link: YouTubeLink -- needed in the get_audio
async def get_audio(link: YouTubeLink):
    logger.info(f"Processing youtube link: {link.youtubeLink}")

    youtube_downloader_options ={
        'format': 'm4a/bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3'
        }],
        'outtmpl': os.path.join(DOWNLOADS_FOLDER, '%(title)s.%(ext)s')
    }

    with yt_dlp.YoutubeDL(youtube_downloader_options) as ydl:
           info = ydl.extract_info(link.youtubeLink)

def test_get_audio(link):
    logger.info(f"Processing youtube link: {link}")
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



if __name__ == "__main__":
    logger.info(f"Starting log")
    import uvicorn
    # uvicorn.run(app, host="0.0.0.0",port=8001)
    testLink = "https://www.youtube.com/watch?v=1-M4JrFcrNY"
    test_get_audio(testLink)