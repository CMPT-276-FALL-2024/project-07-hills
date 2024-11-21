import asyncio

import dlp as dlp
import yt_dlp

from ytdl import get_audio
from genius import get_genius_lyrics
from fastapi import FastAPI, HTTPException, WebSocket, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
from datetime import datetime
import glob
import uvicorn
from spotify import *
from Song import *
from Task import *

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


class SearchQuery(BaseModel):
    query: str  # The text string sent from the frontend


DOWNLOADS_FOLDER = "./downloads"

# Iniliaze SpotifyDIY object
# spotify = SpotifyDIY(env_file="python.env")

# @app.post("/search-songs")
# async def search_songs(search_query: SearchQuery):

# This will handle the loading bars

tasks = {}
class TaskCreateRequest(BaseModel):
    query: str


# todo above is a dictionary of tasks
@app.post("/task/create")
async def create_task(request: TaskCreateRequest, background_tasks: BackgroundTasks):
    task = Task()  # Create a new task instance
    tasks[task.id] = task  # Store task in the task dictionary
    background_tasks.add_task(process_task, task, request.query)  # Add task to background tasks
    return {"task_id": str(task.id)}

# Task status endpoint
@app.get("/task/status/{task_id}")
async def get_task_status(task_id: UUID):
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task.dict()

@app.get("/task/output/{task_id}")
async def get_task_output(task_id: UUID):
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.progress < 100:
        raise HTTPException(status_code=400, detail="Task is still in progress")
    return {"result": task.result}


@app.post("/fetch-song")
async def fetch_song(search_query: SearchQuery):
    try:
        track = spotify.get_single_track(search_query.query)
        lyrics = spotify.get_lyrics(track)

        # Check for lyrics
        if not lyrics:
            raise HTTPException(status_code=404, detail="Lyrics not found for this song")

        # Create and return song object
        song = Song.create_from_track(track, lyrics)
        song.get_audio()
        # This should be where the loading bar disapears
        return song
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# @app.post("/submit-link")
# async def submit_link(link: str):
#     logger.info(f"Received Youtube link: {link}")

#     # Call the ytdl.py file and send it the link
#     # should receive the file_path from the yt-dl.py file and send it over to the
#     try:
#         audio_data = await get_audio(link)  # Call the async get_audio function
#         json = JSONResponse(content=audio_data)
#         audio_path = audio_data["file_path"]  # Extract path from get_audio
#         song_name = audio_data["song_name"]
#         artist = audio_data["artist"]
#             # Separate the audio to generate an instrumental
#         instrumental_path = separate_audio(audio_path)

#         lyrics_data = get_genius_lyrics(song_name, artist)

#         instrumental_url = f"/static/{os.path.basename(instrumental_path)}"

#         return JSONResponse(content={
#                 "song_name": lyrics_data["title"],
#                 "artist": lyrics_data["artist"],
#                 "instrumental_url": instrumental_url,
#                 "lyrics": lyrics_data
#                 "message": "Processing complete"      
#         })

#     except Exception as e:
#         logger.error(f"Error processing link: {e}")
#         raise HTTPException(status_code=500, detail="Failed to process YouTube link")


if __name__ == "__main__":
    logger.info(f"Starting log")
    uvicorn.run(app, host="0.0.0.0", port=8000)

    # testLink = "https://www.youtube.com/watch?v=1-M4JrFcrNY"
    # test_get_audio(testLink)
