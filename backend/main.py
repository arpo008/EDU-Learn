from fastapi import FastAPI, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import requests
from dotenv import load_dotenv
from pathlib import Path

# --- NEW IMPORTS FOR FIREBASE ---
import firebase_admin
from firebase_admin import credentials, auth

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

# ======================================================
# 🔥 FIREBASE ADMIN SETUP (NEW ADDITION)
# ======================================================
# আপনার serviceAccountKey.json ফাইলটি main.py এর পাশেই থাকতে হবে
cred_path = base_dir / "serviceAccountKey"

try:
    if not firebase_admin._apps: # অ্যাপ যদি আগে ইনিশিলাইজ না হয়ে থাকে
        if cred_path.exists():
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK Initialized!")
        else:
            print("⚠️ Warning: 'serviceAccountKey.json' not found. Auth features won't work.")
except Exception as e:
    print(f"❌ Firebase Init Error: {e}")

# --- AUTH DEPENDENCY (Verify Token from Frontend) ---
async def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        # Frontend sends: "Bearer <token>"
        token = authorization.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        return decoded_token # এতে ইউজারের uid, email সব থাকে
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ======================================================
# 📦 EXISTING DATA LOADING (No Changes)
# ======================================================
def load_all_data():
    combined_data = {}
    json_files = ["class7_dataset.json", "class8_dataset.json", "dataset.json"]
    
    for filename in json_files:
        file_path = base_dir / filename
        if file_path.exists():
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                    if "class" in data and "subjects" in data:
                        class_key = f"class{data['class']}"
                        if class_key in combined_data:
                             combined_data[class_key].update(data["subjects"])
                        else:
                             combined_data[class_key] = data["subjects"]
                             
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

# ======================================================
# 🔒 NEW AUTHENTICATED ROUTE EXAMPLE
# ======================================================
@app.get("/auth/me")
def get_current_user_info(user = Depends(verify_token)):
    # এই রাউটটি শুধু লগইন করা ইউজাররাই এক্সেস করতে পারবে
    return {
        "status": "authenticated",
        "uid": user['uid'],
        "email": user.get('email'),
        "message": "You are verified by Firebase Admin!"
    }

# ======================================================
# 🎥 EXISTING API: GET CLASS VIDEOS (No Changes)
# ======================================================
@app.get("/get-class-videos")
def get_class_videos(class_name: str = "class7"):
    formatted_name = class_name.lower().replace(" ", "")
    
    if formatted_name in db:
        return {"status": "success", "data": db[formatted_name]}
    else:
        print(f"Requested: {formatted_name}, Available keys: {list(db.keys())}")
        return {"status": "error", "message": "Class not found", "data": {}}

# ======================================================
# 🧠 EXISTING SMART SEARCH API (No Changes)
# ======================================================
@app.post("/smart-search")
def smart_search(query: SearchQuery):
    user_q = query.question.lower()
    found_video = None
    
    # Video Search Logic
    for class_name, subjects in db.items():
        for subject, topics in subjects.items():
            for item in topics:
                if user_q in item['topic'].lower():
                    start_time = 0
                    end_time = 0
                    if 'segments' in item and len(item['segments']) > 0:
                         start_time = time_to_seconds(item['segments'][0]['start'])
                         end_time = time_to_seconds(item['segments'][0]['end'])
                    
                    found_video = {
                        "url": item['url'],
                        "start": start_time,
                        "end": end_time,
                        "title": item['topic']
                    }
                
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