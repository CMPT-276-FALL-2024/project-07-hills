from pydantic import BaseModel

class Song(BaseModel):
    title: str
    artist: str
    lyrics: str
    ori
    instrumental_url: str
    