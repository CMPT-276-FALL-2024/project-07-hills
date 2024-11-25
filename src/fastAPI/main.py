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
from spotify_singleton import SpotifySingleton

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
spotify = SpotifySingleton.get_instance()

# @app.post("/search-songs")
# async def search_songs(search_query: SearchQuery):

# This will handle the loading bars

tasks = {}


class TaskCreateRequest(BaseModel):
    query: str


# todo above is a dictionary of tasks
@app.post("/task/create")
async def create_task(request: TaskCreateRequest, background_tasks: BackgroundTasks):
    '''
        Parameter:
        {
            "query": "spotify_track_id"
        }
        Output
        {
            "task_id": "task_id"
        }
    '''
    task = Task()  # Create a new task instance
    tasks[task.id] = task  # Store task in the task dictionary
    background_tasks.add_task(process_task, task, request.query)  # Add task to background tasks
    return {"task_id": str(task.id)}


# Task status endpoint
@app.get("/task/status/{task_id}")
async def get_task_status(task_id: UUID):
    '''
        Get the status of the task of the given task_id
        
        Parameter: No paramater, to make this GET request, put a task_id onto the link like this:
            "http://127.0.0.1:8000/task/output/task_id"
        Output: Returns a Task json
        {
            "id": "aaebb6b1-175f-4f36-8dcc-ab1d6fec3134",
            "status": "Completed",
            "progress": 100,
            "result": "http://localhost:8000/static/Radiohead%20-%20Creep_%28Instrumental%29_UVR-MDX-NET-Inst_HQ_3.mp3"
        }
    '''
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task.dict()


@app.get("/task/output/{task_id}")
async def get_task_output(task_id: UUID):
    '''
        Get the instrumental_URL belonging to the task
        
        Parameter: No paramater, to make this GET request, put a task_id onto the link like this:
            "http://127.0.0.1:8000/task/output/task_id"
        Output: Returns an instrumental_URL
        {
            "result": "http://localhost:8000/static/Radiohead%20-%20Creep_%28Instrumental%29_UVR-MDX-NET-Inst_HQ_3.mp3"
        }
    '''
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.progress < 100:
        raise HTTPException(status_code=400, detail="Task is still in progress")
    return {"result": task.result}

@app.post("/search-songs")
async def search_songs(search_query: SearchQuery):
    '''
    Parameter:
    {
        "query": "song name"
    }
    Output: List of 6 song objects
    '''
    try:
        print("gigity")
        track_list = spotify.get_tracks(search_query.query)
        song_obj_list = []
        if not track_list:
            raise HTTPException(status_code=404, detail="No tracks found for the given query.")
        for track in track_list:
            try:
                # Create a Song object
                song = Song.create_from_track(track, None)

                # Append the song object to the list
                song_obj_list.append(song)
                
            except Exception as e:
                logger.error(f"Error processing track {track.get('name', 'Unknown Track')}: {e}")
        
        return song_obj_list
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


@app.post("/fetch-song")
async def fetch_song(song: Song):
    """
    Takes in a Song object, check if it has lyrics, return lyric-ed song object if it has.
    
    Parameter: A song object like this:
        {
            "title": "Creep",
            "artist": "Radiohead",
            "spotify_id": "70LcF31zb1H0PyJoS1Sx1r",
            "spotify_url": "https://open.spotify.com/track/70LcF31zb1H0PyJoS1Sx1r",
            "instrumental_url": "",
            "duration": "3m 58s",
            "album_image_URL": "https://i.scdn.co/image/ab67616d0000b273df55e326ed144ab4f5cecf95",
            "lyrics":
        }
        
    Output: Returns an equivalent Song object with lyrics
        {
            song object with lyirics
        }
    """
    try:
        lyrics = spotify.get_lyrics_from_id(song.spotify_id)
        if lyrics is None:
            raise HTTPException(status_code=404, detail="Lyrics not found for this song")
            
        song.lyrics = lyrics
        return song
    except HTTPException as http_exc:
        # Let HTTPExceptions propagate as is
        raise http_exc
    except Exception as e:
        # Handle errors and send an HTTP exception response
        logger.error(f"Error processing song with ID {song.spotify_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing the song: {str(e)}")

@app.post("/get-audio")
async def get_audio(song: Song):
    """
    Receives a song object with an empty instrumental_url.
    Generates the instrumental file if it doesn't exist, and returns the URL.
    """
    try:
        # Check if the song already has an instrumental file
        if song.instrumental_URL:
            return song.instrumental_URL
        song.get_audio()
        return song.instrumental_URL
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")


# @app.get("/delete-song")
#     #takes a query
#     # Deletes files associated with that song



if __name__ == "__main__":
    logger.info(f"Starting log")
    uvicorn.run(app, host="0.0.0.0", port=8000)

    # testLink = "https://www.youtube.com/watch?v=1-M4JrFcrNY"
    # test_get_audio(testLink)
