from datetime import datetime
import re
from dateutil import parser
from typing import Dict, Any

def extract_date(text: str) -> str:
    """Extract date from text using various methods."""
    # Common date patterns
    date_patterns = [
        r'tomorrow',
        r'today',
        r'next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)',
        r'(in|after) \d+ (day|week|month|hour|minute)s?',
        r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',
        r'\d{1,2} (january|february|march|april|may|june|july|august|september|october|november|december)',
    ]
    
    # Try to find dates using patterns
    for pattern in date_patterns:
        match = re.search(pattern, text.lower())
        if match:
            try:
                return str(parser.parse(match.group()))
            except:
                continue
    
    return None

def extract_task(doc) -> str:
    """Extract the main task from the text."""
    # Look for verb phrases that might indicate tasks
    task_patterns = [
        "remind me to",
        "need to",
        "have to",
        "must",
        "should"
    ]
    
    text = doc.text.lower()
    
    for pattern in task_patterns:
        if pattern in text:
            # Get the text after the pattern
            task_start = text.find(pattern) + len(pattern)
            task_text = text[task_start:].strip()
            # Clean up the task text
            return task_text.split(" on ")[0].split(" at ")[0].strip()
    
    # If no pattern found, return the main verb phrase
    for token in doc:
        if token.dep_ == "ROOT" and token.pos_ == "VERB":
            return " ".join([tok.text for tok in token.subtree]).strip()
    
    return doc.text

def extract_app(text: str) -> str:
    """Extract mentioned app names from text."""
    common_apps = {
        "google calendar": "google_calendar",
        "calendar": "google_calendar",
        "reminder": "default",
        "todo": "todo",
        "notes": "notes"
    }
    
    text_lower = text.lower()
    
    for app_name, app_id in common_apps.items():
        if app_name in text_lower:
            return app_id
    
    return "default"

def extract_info(nlp, text: str) -> Dict[str, Any]:
    """Main function to extract all relevant information from text."""
    doc = nlp(text)
    
    # Extract basic information
    task = extract_task(doc)
    deadline = extract_date(text)
    app = extract_app(text)
    
    return {
        "task": task,
        "deadline": deadline,
        "app": app,
        "original_text": text
    } 