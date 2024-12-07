from spotify import *
import json
from Song import sanitize_filename
from Song import *

spotify_diy = SpotifyDIY(env_file="python.env")
track = spotify_diy.get_single_track("taki taki")

lyrics = None
song = Song.create_from_track(track, lyrics)
song.download_original()
print(json.dumps(song.dict(), indent=4))
