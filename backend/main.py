from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import requests
from dotenv import load_dotenv
from pathlib import Path

# --- SETUP ---
base_dir = Path(__file__).resolve().parent
env_path = base_dir / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# --- DATA LOADING (Robust Logic) ---
def load_all_data():
    combined_data = {}
    # তোমার ফোল্ডারে থাকা সব JSON ফাইলগুলোর নাম এখানে দাও
    json_files = ["class7_dataset.json", "class8_dataset.json", "dataset.json"]
    
    for filename in json_files:
        file_path = base_dir / filename
        if file_path.exists():
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                    # লজিক ১: যদি ফাইলের ফরম্যাট হয় { "class": "7", "subjects": {...} }
                    if "class" in data and "subjects" in data:
                        class_key = f"class{data['class']}" # যেমন: class7
                        # যদি আগে থেকেই এই ক্লাসের ডেটা থাকে, তবে মার্জ করো, নাহলে নতুন বসাও
                        if class_key in combined_data:
                             combined_data[class_key].update(data["subjects"])
                        else:
                             combined_data[class_key] = data["subjects"]
                             
                    # লজিক ২: যদি ফাইলের ফরম্যাট হয় { "class6": {...}, "class7": {...} } (তোমার dataset.json এর মতো)
                    elif "class6" in data or "class7" in data:
                        combined_data.update(data)
                        
                    print(f"SUCCESS: Loaded {filename}")
            except Exception as e:
                print(f"ERROR reading {filename}: {e}")
    return combined_data

db = load_all_data()

# --- HELPER: Time Convert ---
def time_to_seconds(time_str):
    try:
        if isinstance(time_str, int): return time_str
        parts = time_str.split(':')
        return int(parts[0]) * 60 + int(parts[1])
    except:
        return 0

# --- MODELS ---
class SearchQuery(BaseModel):
    question: str
    student_class: str = "class7" 

@app.get("/")
def read_root():
    return {"status": "EduLearn Backend Running"}

# --- API: GET CLASS VIDEOS (Enroll Button এর জন্য জরুরি) ---
@app.get("/get-class-videos")
def get_class_videos(class_name: str = "class7"):
    # ছোট হাতের অক্ষরে কনভার্ট করে স্পেস রিমুভ করা ("Class 7" -> "class7")
    formatted_name = class_name.lower().replace(" ", "")
    
    if formatted_name in db:
        return {"status": "success", "data": db[formatted_name]}
    else:
        # ডিবাগিং এর জন্য প্রিন্ট
        print(f"Requested: {formatted_name}, Available keys: {list(db.keys())}")
        return {"status": "error", "message": "Class not found", "data": {}}

# --- SMART SEARCH API ---
@app.post("/smart-search")
def smart_search(query: SearchQuery):
    user_q = query.question.lower()
    found_video = None
    
    # Video Search Logic
    for class_name, subjects in db.items():
        for subject, topics in subjects.items():
            for item in topics:
                # Main Topic Check
                if user_q in item['topic'].lower():
                    start_time = 0
                    end_time = 0
                    # Check segments
                    if 'segments' in item and len(item['segments']) > 0:
                         start_time = time_to_seconds(item['segments'][0]['start'])
                         end_time = time_to_seconds(item['segments'][0]['end'])
                    
                    found_video = {
                        "url": item['url'],
                        "start": start_time,
                        "end": end_time,
                        "title": item['topic']
                    }
                
                # Segment Check
                for seg in item.get('segments', []):
                    if user_q in seg['title'].lower():
                        found_video = {
                            "url": item['url'],
                            "start": time_to_seconds(seg['start']),
                            "end": time_to_seconds(seg['end']),
                            "title": seg['title']
                        }
                        break
                if found_video: break
            if found_video: break
        if found_video: break
    
    if not found_video:
        found_video = {"url": "", "start": 0, "end": 0, "title": "No specific video found"}

    # AI Explanation
    explanation = "Thinking..."
    
    if not GOOGLE_API_KEY:
        explanation = "Error: API Key Missing."
    else:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GOOGLE_API_KEY}"
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"Explain this concept to a {query.student_class} student simply in 3 short sentences: {query.question}"
                }]
            }]
        }
        try:
            response = requests.post(url, json=payload)
            data = response.json()
            if "candidates" in data:
                explanation = data["candidates"][0]["content"]["parts"][0]["text"]
            else:
                explanation = "I am unable to generate an explanation right now."
        except:
            explanation = "Connection to AI failed."

    return {
        "topic": found_video['title'],
        "explanation": explanation,
        "videoUrl": found_video['url'],
        "startSeconds": found_video['start'],
        "endSeconds": found_video['end']
    }