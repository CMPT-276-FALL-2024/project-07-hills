import time
from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field
from spotify import *
from Song import *
from Task import *

class Task(BaseModel):
    # Create a task with a unique id
    id: UUID = Field(default_factory=uuid4)
    status: str = "Initializing..."
    progress: int = 0
    result: Optional[str] = None  # Placeholder

    def update_progress(self, status: str, progress: int):
        self.status = status
        self.progress = progress

    def complete(self, result: str):
        self.status = "Completed"
        self.progress = 100
        self.result = result

    def fail(self, error_message: str):
        self.status = "Failed"
        self.progress = 0
        self.result = error_message


# Simulate task processing
def process_task_test(task: Task, query: str):
    try:
        task.update_progress("Downloading audio", 20)
        time.sleep(5)  # Simulate download time
        print("Progress is now ", task.progress)
        task.update_progress("Processing audio", 60)
        time.sleep(5)  # Simulate processing time
        print("Progress is now ", task.progress)

        task.complete(f"Processed data for query: {query}")
    except Exception as e:
        task.fail(str(e))

spotify = SpotifyDIY(env_file="python.env")


def process_task(task: Task, query: str):
    try:
        # Step 1: Initialize
        task.update_progress("Initializing task", 10)

        # Step 2: Fetch the track details
        task.update_progress("Fetching track details", 30)
        track = spotify.get_single_track(query)

        # Step 3: Fetch lyrics
        task.update_progress("Fetching lyrics", 50)
        lyrics = spotify.get_lyrics(track)
        if not lyrics:
            raise ValueError("Lyrics not found")

        # Step 4: Download audio
        task.update_progress("Downloading audio", 70)
        song = Song.create_from_track(track, lyrics)
        song.get_audio()

        # Step 5: Complete
        task.complete({
            "title": song.title,
            "artist": song.artist,
            "duration": song.duration,
            "lyrics": song.lyrics.lines,
            "instrumental_URL": song.instrumental_URL,
        })
    except Exception as e:
        task.fail(str(e))

