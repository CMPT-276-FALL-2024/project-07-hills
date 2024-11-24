# from Song import *
from spotify import *
import json
from Song import sanitize_filename
from Song import *

spotify_diy = SpotifyDIY(env_file="python.env")
track = spotify_diy.get_single_track_by_id("70LcF31zb1H0PyJoS1Sx1r")

lyrics = None
song = Song.create_from_track(track, lyrics)
print(song)
# print(track)

# lyrics = spotify_diy.get_lyrics(track)

# song = Song.create_from_track(track, lyrics)
# song.get_audio()

# print(json.dumps(song.dict(), indent=4))