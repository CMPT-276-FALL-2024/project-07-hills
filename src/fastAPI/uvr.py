from audio_separator.separator import Separator

DOWNLOADS_FOLDER = "./downloads"

# Initialize the Separator class (with optional configuration properties, below)
separator = Separator(
    model_file_dir="/tmp/audio-separator-models/",
    output_dir=DOWNLOADS_FOLDER,
    output_format="mp3",
    normalization_threshold=0.9,
    output_single_stem="Instrumental",
    sample_rate=44100,
    mdx_params={
        "hop_length": 1024,
        "segment_size": 256,
        "overlap": 0.25,
        "batch_size": 8
    }
)

# Load Model
separator.load_model(model_filename="UVR-MDX-NET-Inst_HQ_3.onnx")

# Perform the separation on specific audio files without reloading the model
output_files = separator.separate('downloads/The Real Slim Shady.mp3')

print(f"Separation complete! Output file(s): {' '.join(output_files)}")