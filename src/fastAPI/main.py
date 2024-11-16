import dlp as dlp
import yt_dlp
from ytdl import get_audio
from uvr import separate_audio
from genius import get_genius_lyrics
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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
app.mount("/static", StaticFiles(directory="./downloads/instrumental"), name="static")

# Configure CORS to allow requests from your frontend (or set origins=["*"] to allow all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins like ["http://localhost:3000"] if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods, or use ["POST"] if only POST should be allowed
    allow_headers=["*"],  # Allows all headers
)


class YouTubeLink(BaseModel):
    youtubeLink: str


DOWNLOADS_FOLDER = "./downloads"


@app.post("/submit-link")
async def submit_link(link: str):
    logger.info(f"Received Youtube link: {link}")

    # Call the ytdl.py file and send it the link
    # should receive the file_path from the yt-dl.py file and send it over to the
    try:
        audio_data = await get_audio(link)  # Call the async get_audio function
        json = JSONResponse(content=audio_data)
        audio_path = audio_data["file_path"]  # Extract path from get_audio
        song_name = audio_data["song_name"]
        artist = audio_data["artist"]


    except Exception as e:
        logger.error(f"Error processing link: {e}")
        raise HTTPException(status_code=500, detail="Failed to process YouTube link")

    # Separate the audio to generate an instrumental
    instrumental_path = separate_audio(audio_path)
    #   Get lyrics from genius -- maybe do this async
    get_genius_lyrics(song_name, artist)

#     send the instrumental path to the json


if __name__ == "__main__":
    logger.info(f"Starting log")
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
    
    # testLink = "https://www.youtube.com/watch?v=1-M4JrFcrNY"
    # test_get_audio(testLink)
