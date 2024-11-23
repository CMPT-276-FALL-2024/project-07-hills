# from Song import *
from spotify import *
import json
from Song import sanitize_filename


spotify_diy = SpotifyDIY(env_file="python.env")
track = spotify_diy.get_single_track("love story")

print(track)
# print(track)

# lyrics = spotify_diy.get_lyrics(track)

# song = Song.create_from_track(track, lyrics)
# song.get_audio()

# print(json.dumps(song.dict(), indent=4))