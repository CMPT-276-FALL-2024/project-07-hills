from syrics.api import Spotify
import json

sp = Spotify("AQBnq1-gKi5YR_-KWuKbcxgSHL8KIXtVfRtx1h9DBea-clrgS_3Svm9h78UjjrF1y0D-2X96bwwWUpUt_gvbu34volkoUn1bSzLIedqs_GUYzHnHOUJEbHllqkxS1GECc70On55LMQhOv9iB9lUtJD2dJvC_OQ-0")

lyrics = sp.get_lyrics("7lQ8MOhq6IN2w8EYcFNSUk")

print(json.dumps(lyrics, indent=4))