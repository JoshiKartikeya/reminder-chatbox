from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from nlp_utils import extract_info

app = Flask(__name__)
CORS(app)

# Load English language model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If model isn't downloaded, download it
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "NLP service is running"})

@app.route('/extract', methods=['POST'])
def extract():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                "error": "No text provided"
            }), 400

        text = data['text']
        
        # Extract information using nlp_utils
        extracted_info = extract_info(nlp, text)
        
        return jsonify(extracted_info)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 