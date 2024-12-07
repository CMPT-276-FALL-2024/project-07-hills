from separator_manager import get_separator
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def test_separator():
    """
    Test the separator with a sample audio file.
    """
    TEST_AUDIO_FILE = "./downloads/Blur - Song 2.mp3"
    if not os.path.exists(TEST_AUDIO_FILE):
        logger.error(f"Test audio file not found: {TEST_AUDIO_FILE}")
        return

    try:
        separator = get_separator()  # Initialize the separator
        logger.info(f"Testing separation on file: {TEST_AUDIO_FILE}")
        instrumental_path = separator.separate(TEST_AUDIO_FILE)[0]
        logger.info(f"Generated instrumental: {instrumental_path}")
    except Exception as e:
        logger.error(f"Error during separation: {e}")

if __name__ == "__main__":
    test_separator()
