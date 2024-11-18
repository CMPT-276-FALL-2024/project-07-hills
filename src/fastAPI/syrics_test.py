from syrics.api import Spotify
import json

sp = Spotify("AQBhbWVZc1X9XxlywNmMa7uIr8H_dfx5vGbAoKk1ycUj3_spUwHB4a24wbcUXcIUb__wsxC_kgxnYd6RoqCQgIZ83UtfqeRC3vUzCsnymQq2cIBs166GvXPPWomfNxyAI2SY5GA330lZOY1sJHjM7IpRNwK_hXE")

lyrics = sp.get_lyrics("3GCL1PydwsLodcpv0Ll1ch")

print(json.dumps(lyrics['lyrics']['lines'], indent=4))
