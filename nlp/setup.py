import subprocess
import sys

def setup_nlp():
    """Setup script to install requirements and download spacy model."""
    print("Installing requirements...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    print("Downloading spaCy model...")
    subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
    
    print("Setup complete!")

if __name__ == "__main__":
    setup_nlp() 