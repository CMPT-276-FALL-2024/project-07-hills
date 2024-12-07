from audio_separator.separator import Separator
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Constants
MODEL_DIR = "/tmp/audio-separator-models/"
OUTPUT_FOLDER = "./downloads/instrumental"
MODEL_FILE_NAME = "UVR-MDX-NET-Inst_HQ_3.onnx"

# Singleton instance
_separator_instance = None

def get_separator():
    """
    Returns a singleton instance of the Separator. Initializes it if not already initialized.
    """
    global _separator_instance
    if _separator_instance is None:
        try:
            logger.info("Initializing Separator...")
            _separator_instance = Separator(
                model_file_dir=MODEL_DIR,
                output_dir=OUTPUT_FOLDER,
                output_format="mp3",
                normalization_threshold=0.9,
                output_single_stem="Instrumental",
                sample_rate=44100,
                mdx_params={
                    "hop_length": 1024,
                    "segment_size": 128,  # Adjust as needed
                    "overlap": 0.1,
                    "batch_size": 8,
                },
            )
            logger.info("Loading model...")
            _separator_instance.load_model(model_filename=MODEL_FILE_NAME)
            logger.info("Model loaded successfully.")
        except Exception as e:
            logger.error(f"Error initializing Separator: {e}")
            raise RuntimeError("Failed to initialize Separator.")
    return _separator_instance
