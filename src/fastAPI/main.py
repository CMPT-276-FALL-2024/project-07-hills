import asyncio
import os
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from spotify_singleton import SpotifySingleton

# from ytdl import get_audio
# from genius import get_genius_lyrics
from spotify import *
from Song import *
from Task import *
# from spotify_singleton import SpotifySingleton
# from audio_separator.separator import Separator
from Task import Task, process_task
from uuid import UUID
from audio_separator.separator import Separator
from separator_manager import get_separator


# Configure logging
LOGS_FOLDER = "./logs"
os.makedirs(LOGS_FOLDER, exist_ok=True)
current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
log_filename = os.path.join(LOGS_FOLDER, f"{current_time}.txt")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(log_filename),
        logging.StreamHandler(),
    ]
)
logger = logging.getLogger(__name__)

# FastAPI app setup
app = FastAPI()
app.mount("/static", StaticFiles(directory="./downloads/instrumental"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://voca-free1.vercel.app",
    "https://voca-free1-62ser9hx4-parsas-projects-58991dcb.vercel.app",
    "https://teaching-gorilla-rich.ngrok-free.app"],  # this used to be just a *
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths and configuration
DOWNLOADS_FOLDER = "./downloads"
OUTPUT_FOLDER = "./downloads/instrumental"
MODEL_DIR = "/tmp/audio-separator-models/"
MODEL_FILE_NAME = "UVR-MDX-NET-Inst_HQ_3.onnx"
os.makedirs(DOWNLOADS_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Initialize global variables
tasks = {}
spotify = SpotifySingleton.get_instance()
separator = None  # Will be initialized during app startup


class SearchQuery(BaseModel):
    query: str  # The text string sent from the frontend

# Initialize global variables
# tasks = {}
# spotify = SpotifySingleton.get_instance()

@app.on_event("startup")
def load_model():
    """Preload model during app startup."""
    global separator
    try:
        logger.info("Fetching Separator...")
        separator = get_separator()  # Use the shared separator instance
        logger.info("Separator initialized and model loaded.")
    except Exception as e:
        logger.error(f"Error during model loading: {e}")
        raise


# FastAPI endpoints
class TaskCreateRequest(BaseModel):
    query: str


@app.post("/task/create")
async def create_task(request: TaskCreateRequest, background_tasks: BackgroundTasks):
    task = Task()
    tasks[task.id] = task
    background_tasks.add_task(process_task, task, request.query)
    return {"task_id": str(task.id)}


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


@app.post("/task/terminate/{task_id}")
async def terminate_task(task_id: UUID):
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.terminate()
    return {"message": f"Task {task_id} terminated successfully"}


@app.post("/search-songs")
async def search_songs(search_query: SearchQuery):
    try:
        logger.info(f"Searching songs for query: {search_query.query}")
        track_list = spotify.get_tracks(search_query.query)
        if not track_list:
            raise HTTPException(status_code=404, detail="No tracks found for the given query.")

        song_obj_list = []
        for track in track_list:
            try:
                song = Song.create_from_track(track, None)
                song_obj_list.append(song)
            except Exception as e:
                logger.error(f"Error processing track {track.get('name', 'Unknown Track')}: {e}")

        return song_obj_list
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error during search: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


@app.post("/fetch-song")
async def fetch_song(song: Song):
    try:
        lyrics = spotify.get_lyrics_from_id(song.spotify_id)
        if lyrics is None:
            raise HTTPException(status_code=404, detail="Lyrics not found for this song")
        song.lyrics = lyrics
        return song
    except Exception as e:
        logger.error(f"Error fetching song: {e}")
        raise HTTPException(status_code=500, detail="Error processing the song.")

@app.post("/get-audio")
async def generate_instrumental(song: Song):
    try:
        if song.instrumental_URL:
            return {"instrumental_URL": song.instrumental_URL}

        logger.info(f"Processing audio for song: {song.title}")
        separator = get_separator()
        file_path = os.path.join(DOWNLOADS_FOLDER, f"{song.title}.mp3")
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Audio file not found")

        instrumental_path = separator.separate(file_path)[0]
        song.instrumental_URL = f"https://vocafree.ngrok.app/static/{os.path.basename(instrumental_path)}"
        return {"instrumental_URL": song.instrumental_URL}
    except Exception as e:
        logger.error(f"Error generating instrumental: {e}")
        raise HTTPException(status_code=500, detail="Error processing audio.")


# @app.post("/get-audio")
# async def generate_instrumental(song: Song):
#     try:
#         if song.instrumental_URL:
#             return song.instrumental_URL

#         # Check if instrumental exists and generate if not
#         logger.info(f"Processing audio for song: {song.title}")
#         file_path = os.path.join(DOWNLOADS_FOLDER, song.title + ".mp3")
#         instrumental_path = separator.separate(file_path)[0]
#         song.instrumental_URL = f"http://localhost:8000/static/{os.path.basename(instrumental_path)}"
#         return song.instrumental_URL
#     except Exception as e:
#         logger.error(f"Error generating instrumental: {e}")
#         raise HTTPException(status_code=500, detail="Error processing audio.")
if __name__ == "__main__":
    logger.info("Starting FastAPI application...")
    uvicorn.run(app, host="0.0.0.0", port=80)
# import asyncio
# import os
# import logging
# from datetime import datetime
# from fastapi import FastAPI, HTTPException, BackgroundTasks
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from pydantic import BaseModel
# from uuid import UUID
# import uvicorn

# from ytdl import get_audio
# from genius import get_genius_lyrics
# from spotify import *
# from Song import *
# from Task import *
# from spotify_singleton import SpotifySingleton
# from audio_separator.separator import Separator

# # Configure logging
# LOGS_FOLDER = "./logs"
# os.makedirs(LOGS_FOLDER, exist_ok=True)
# current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
# log_filename = os.path.join(LOGS_FOLDER, f"{current_time}.txt")

# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
#     handlers=[
#         logging.FileHandler(log_filename),
#         logging.StreamHandler(),
#     ]
# )
# logger = logging.getLogger(__name__)

# # FastAPI app setup
# app = FastAPI()
# app.mount("/static", StaticFiles(directory="./downloads/instrumental"), name="static")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust as needed
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Global variables and paths
# DOWNLOADS_FOLDER = "./downloads"
# OUTPUT_FOLDER = "./downloads/instrumental"
# MODEL_DIR = "/tmp/audio-separator-models/"
# MODEL_FILE_NAME = "UVR-MDX-NET-Inst_HQ_3.onnx"
# os.makedirs(DOWNLOADS_FOLDER, exist_ok=True)
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# tasks = {}
# spotify = SpotifySingleton.get_instance()
# separator = None  # Global variable for the separator


# @app.on_event("startup")
# def load_model():
#     """Preload the separator model during startup."""
#     global separator
#     logger.info("Initializing Separator...")
#     try:
#         separator = Separator(
#             model_file_dir=MODEL_DIR,
#             output_dir=OUTPUT_FOLDER,
#             output_format="mp3",
#             normalization_threshold=0.9,
#             output_single_stem="Instrumental",
#             sample_rate=44100,
#             mdx_params={
#                 "hop_length": 1024,
#                 "segment_size": 128,  # Adjust as needed
#                 "overlap": 0.1,
#                 "batch_size": 8,  # Adjust for memory limits
#             },
#         )
#         logger.info("Separator initialized. Loading model...")
#         separator.load_model(model_filename=MODEL_FILE_NAME)
#         logger.info("Model loaded successfully.")
#     except Exception as e:
#         logger.error(f"Error during model loading: {e}")
#         raise


# class SearchQuery(BaseModel):
#     query: str  # The text string sent from the frontend


# class TaskCreateRequest(BaseModel):
#     query: str


# @app.post("/task/create")
# async def create_task(request: TaskCreateRequest, background_tasks: BackgroundTasks):
#     task = Task()  # Create a new task instance
#     tasks[task.id] = task  # Store task in the task dictionary
#     background_tasks.add_task(process_task, task, request.query)  # Add task to background tasks
#     return {"task_id": str(task.id)}


# @app.get("/task/status/{task_id}")
# async def get_task_status(task_id: UUID):
#     task = tasks.get(task_id)
#     if not task:
#         raise HTTPException(status_code=404, detail="Task not found")
#     return task.dict()


# @app.get("/task/output/{task_id}")
# async def get_task_output(task_id: UUID):
#     task = tasks.get(task_id)
#     if not task:
#         raise HTTPException(status_code=404, detail="Task not found")
#     if task.progress < 100:
#         raise HTTPException(status_code=400, detail="Task is still in progress")
#     return {"result": task.result}


# @app.post("/search-songs")
# async def search_songs(search_query: SearchQuery):
#     try:
#         logger.info(f"Searching songs for query: {search_query.query}")
#         track_list = spotify.get_tracks(search_query.query)
#         if not track_list:
#             raise HTTPException(status_code=404, detail="No tracks found for the given query.")

#         song_obj_list = []
#         for track in track_list:
#             try:
#                 song = Song.create_from_track(track, None)
#                 song_obj_list.append(song)
#             except Exception as e:
#                 logger.error(f"Error processing track {track.get('name', 'Unknown Track')}: {e}")

#         return song_obj_list
#     except ValueError as e:
#         raise HTTPException(status_code=404, detail=str(e))
#     except Exception as e:
#         logger.error(f"Unexpected error during search: {e}")
#         raise HTTPException(status_code=500, detail="An unexpected error occurred.")


# @app.post("/fetch-song")
# async def fetch_song(song: Song):
#     try:
#         lyrics = spotify.get_lyrics_from_id(song.spotify_id)
#         if lyrics is None:
#             raise HTTPException(status_code=404, detail="Lyrics not found for this song")
#         song.lyrics = lyrics
#         return song
#     except Exception as e:
#         logger.error(f"Error fetching song: {e}")
#         raise HTTPException(status_code=500, detail="Error processing the song.")


# @app.post("/get-audio")
# async def generate_instrumental(song: Song):
#     try:
#         if song.instrumental_URL:
#             return song.instrumental_URL

#         # Check if instrumental exists and generate if not
#         logger.info(f"Processing audio for song: {song.title}")
#         file_path = os.path.join(DOWNLOADS_FOLDER, song.title + ".mp3")
#         instrumental_path = separator.separate(file_path)[0]
#         song.instrumental_URL = f"http://localhost:8000/static/{os.path.basename(instrumental_path)}"
#         return song.instrumental_URL
#     except Exception as e:
#         logger.error(f"Error generating instrumental: {e}")
#         raise HTTPException(status_code=500, detail="Error processing audio.")


# @app.post("/task/terminate/{task_id}")
# async def terminate_task(task_id: UUID):
#     task = tasks.get(task_id)
#     if not task:
#         raise HTTPException(status_code=404, detail="Task not found")
#     task.terminate()
#     return {"message": f"Task {task_id} terminated successfully"}


# if __name__ == "__main__":
#     logger.info("Starting FastAPI application...")
#     uvicorn.run(app, host="0.0.0.0", port=8000)
