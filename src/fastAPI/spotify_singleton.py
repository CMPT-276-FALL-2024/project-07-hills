# spotify_singleton.py
from spotify import SpotifyDIY

class SpotifySingleton:
    _instance = None

    @staticmethod
    def get_instance():
        if SpotifySingleton._instance is None:
            SpotifySingleton._instance = SpotifyDIY(env_file="python.env")
        return SpotifySingleton._instance