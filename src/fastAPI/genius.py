import lyricsgenius
import json
import re
from lyricsgenius import Genius

genius = Genius('')

# search for the artist and song and assign it to artist and song
artist = genius.search_artist('Playboi Carti', max_songs=0, sort='title')
song = artist.song('Stop Breathing')

# get the raw lyrics unformatted
raw_lyrics = song.lyrics

# remove unwanted metadata text at the top of genius lyrics pages
cleaned_lyrics = re.sub(
    r"(?i)(Translations|Contributors|Espa\u00f1ol|Portugu\u00eas|English|Deutsch|Français|Русский|Svenska|العربية|Polski|Italiano|Hebrew|Az\u0259rbaycanca|.*\d{3,} Contributors.*)", 
    "", raw_lyrics
).strip()

# prepare data for JSON output
song_data = {
    'title': song.title,
    'artist': artist.name,
    'lyrics': cleaned_lyrics
}

# write the song data to a JSON file with indents for better readability
with open('lyrics.json', 'w') as f:
    json.dump(song_data, f, indent=4) 
