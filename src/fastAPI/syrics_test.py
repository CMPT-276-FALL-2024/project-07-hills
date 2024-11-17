from syrics.api import Spotify
import json
import os

# pip3 install syrics
SP_DC = os.getenv('SP_DC')
if not SP_DC:
    raise ValueError("SP_DC is not set in the environment variables")

sp = Spotify(SP_DC)

lyrics = sp.get_lyrics("0Ajm7DFmbGEURySKm7G2jf?si=a8c70b3436f14f3f")

print(json.dumps(lyrics, indent=4))
