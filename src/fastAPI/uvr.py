from audio_separator.separator import Separator

DOWNLOADS_FOLDER = "./downloads"
OUTPUT_FOLDER = "./downloads/instrumental"

import os
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Initialize the Separator class (with optional configuration properties, below)
separator = Separator(
    model_file_dir="/tmp/audio-separator-models/",
    output_dir=OUTPUT_FOLDER,
    output_format="mp3",
    normalization_threshold=0.9,
    output_single_stem="Instrumental",
    #22050  
    sample_rate=44100,
    mdx_params={
        "hop_length": 1024,
        "segment_size": 512,  # Try increasing if memory permits
        "overlap": 0.1,       # Lower overlap to reduce redundant processing
        "batch_size": 16     # Increase batch size if memory is available
    }
)

# Load Model
separator.load_model(model_filename="UVR-MDX-NET-Inst_HQ_3.onnx")

# Takes in file path, generate an instrumental file and return its file_path
def separate_audio(file_path):
    output_file = separator.separate(file_path)
    # print(f"Separation complete! Output file(s): {' '.join(output_files)}")
    print("separation complete")
    print(output_file)
    return output_file




# # Perform the separation on specific audio files without reloading the model
# output_files = separator.separate('downloads/The Real Slim Shady.mp3')
