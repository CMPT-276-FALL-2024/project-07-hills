from audio_separator.separator import Separator

DOWNLOADS_FOLDER = "./downloads"
OUTPUT_FOLDER = "./downloads/instrumental"

import os
import glob
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.environ["PATH"] += os.pathsep + "/opt/homebrew/bin"
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



def check_instrumental_exists(file_path):
    directory = os.path.dirname(file_path)
    instrumental_directory = os.path.join(directory, "instrumental")
    
    # Get the base name (filename with extension)
    base_name = os.path.basename(file_path)
    base_name_without_extension = os.path.splitext(base_name)[0]
    instrumental_file_name = f"{base_name_without_extension}_(Instrumental)_UVR-MDX-NET-Inst_HQ_3.mp3"
    # Check if the file exists
    full_instrumental_path = os.path.join(instrumental_directory, instrumental_file_name)
    
    if os.path.exists(full_instrumental_path):
        return True, full_instrumental_path
    else:
        return False, None

# Takes in file path, generate an instrumental file and return its file_path
def separate_audio(file_path):
    exists, instrumental_path = check_instrumental_exists(file_path)
    if exists:
        print(f"File already exists at: {instrumental_path}")
        return instrumental_path
    
    instrumental_path = separator.separate(file_path)
    # print(f"Separation complete! Output file(s): {' '.join(output_files)}")
    # print("separation complete")
    instrumental_path = rename_uvr_output(output_file)
    print(instrumental_path)
    return instrumental_path
# # Perform the separation on specific audio files without reloading the model
# output_files = separator.separate('downloads/The Real Slim Shady.mp3')
