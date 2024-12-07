import lyricsgenius
import json
import re
import os

from dotenv import load_dotenv
from lyricsgenius import Genius


def get_genius_lyrics(song_name, artist):
    # Load environment variables from .env file
    load_dotenv()

    genius_token = os.getenv('GENIUS_API_TOKEN')
    if not genius_token:
        raise ValueError("GENIUS_API_TOKEN is not set in the environment variables")
    genius = Genius(genius_token)

    # search for the artist and song and assign it to artist and song
    artist = genius.search_artist(artist, max_songs=0, sort='title')
    song = artist.song(song_name)

    # get the raw lyrics unformatted
    raw_lyrics = song.lyrics

    # remove unwanted metadata text at the top of genius lyrics pages
    cleaned_lyrics = re.sub(
        r"(?i)(Translations|Contributors|Espa\u00f1ol|Portugu\u00eas|English|Deutsch|Français|Русский|Svenska|العربية|Polski|Italiano|Hebrew|Az\u0259rbaycanca|.*\d{3,} Contributors.*)",
        "", raw_lyrics
    ).strip()
    
    return {
        "title": song.title,
        "artist": artist.name,
        "lyrics": cleaned_lyrics,
    }
    
    #  OLD CODE OF WHEN WE WRITE TO JSON FILE
    
    # # prepare data for JSON output
    # song_data = {
    #     'title': song.title,
    #     'artist': artist.name,
    #     'lyrics': cleaned_lyrics
    # }

    # # write the song data to a JSON file with indents for better readability
    # # todo: maybe rename this to the song_name_lyrics.json to be able to save multiples in the future.
    # with open('lyrics.json', 'w') as f:
    #     json.dump(song_data, f, indent=4)
