import time
from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field
from spotify import *
from Song import *
from Task import *
from spotify_singleton import SpotifySingleton


class Task(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    status: str = "Initializing..."
    progress: int = 0
    result: Optional[str] = None  # Placeholder
    is_terminated: bool = False  # Add a termination flag

    def update_progress(self, status: str, progress: int):
        if self.is_terminated:
            raise RuntimeError("Task was terminated")
        self.status = status
        self.progress = progress

    def complete(self, result):
        self.status = "Completed"
        self.progress = 100
        self.result = result

    def fail(self, error_message: str):
        self.status = "Failed"
        self.progress = 0
        self.result = error_message

    def terminate(self):
        self.is_terminated = True
        self.status = "Terminated"
        self.progress = 0
        self.result = None


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



spotify = SpotifySingleton.get_instance()


def process_task(task: Task, query: str):
    try:
        task.update_progress("Initializing task", 10)

        # Check for termination
        if task.is_terminated:
            raise RuntimeError("Task terminated by user")

        task.update_progress("Fetching track details", 20)
        track = spotify.get_single_track_by_id(query)

        if task.is_terminated:
            raise RuntimeError("Task terminated by user")

        task.update_progress("Fetching lyrics", 30)
        lyrics = spotify.get_lyrics_from_track(track)
        if not lyrics:
            raise ValueError("Lyrics not found")

        if task.is_terminated:
            raise RuntimeError("Task terminated by user")

        task.update_progress("Receiving song name", 40)
        song = Song.create_from_track(track, lyrics)

        if task.is_terminated:
            raise RuntimeError("Task terminated by user")

        task.update_progress("Downloading song", 50)
        song.download_audio()

        if task.is_terminated:
            raise RuntimeError("Task terminated by user")

        task.update_progress("Separating Vocals", 95)
        song.get_instrumental()
        
        if task.is_terminated:
            raise RuntimeError("Task terminated by user")

        task.complete(song.instrumental_URL)

    except RuntimeError as e:
        if str(e) == "Task terminated by user":
            task.terminate()
        else:
            task.fail(str(e))
    except Exception as e:
        task.fail(str(e))
