from separator_manager import get_separator
import logging
import os

# Configure logging
logger = logging.getLogger(__name__)

MODEL_FILE_NAME = "UVR-MDX-NET-Inst_HQ_3.onnx"  # Define the model file name

def check_instrumental_exists(file_path):
    """
    Check if the instrumental version of a file already exists.
    """
    directory = os.path.dirname(file_path)
    instrumental_directory = os.path.join(directory, "instrumental")
    base_name = os.path.basename(file_path)
    base_name_without_extension = os.path.splitext(base_name)[0]
    instrumental_file_name = f"{base_name_without_extension}_(Instrumental)_{MODEL_FILE_NAME}.mp3"
    full_instrumental_path = os.path.join(instrumental_directory, instrumental_file_name)

    return os.path.exists(full_instrumental_path), instrumental_file_name


def separate_audio(file_path):
    """
    Generate an instrumental file if it doesn't already exist.
    """
    separator = get_separator()
    try:
        exists, instrumental_name = check_instrumental_exists(file_path)
        if exists:
            logger.info(f"Instrumental file already exists: {instrumental_name}")
            return instrumental_name

        logger.info(f"Processing file: {file_path}")
        instrumental_path = separator.separate(file_path)[0]
        logger.info(f"Instrumental generated: {instrumental_path}")
        return instrumental_path
    except Exception as e:
        logger.error(f"Error during audio separation: {e}")
        raise RuntimeError(f"Failed to process audio: {file_path}")
