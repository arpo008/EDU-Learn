import sys
import json
import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from groq import Groq 

# --- 1. SETUP & IMPORTS ---
try:
    import wikipedia
except ImportError:
    print("Error: wikipedia missing. Run: pip install wikipedia")
    sys.exit(1)

try:
    from youtube_search import YoutubeSearch
except ImportError:
    print("Error: youtube-search missing. Run: pip install youtube-search")
    sys.exit(1)

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    pass 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# 🔑 API KEY CONFIGURATION (GROQ)
# ======================================================
# এখানে আপনার সেই Groq API Key টি বসাবেন যা দিয়ে চ্যাটবট কাজ করছিল
GROQ_API_KEY = "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"  # <--- PASTE YOUR WORKING GROQ KEY HERE

try:
    client = Groq(api_key=GROQ_API_KEY)
    print("✅ Groq AI Client Configured Successfully!")
except Exception as e:
    print(f"❌ Error Configuring Groq: {e}")

# --- 2. LOAD BERT MODEL (For Universal Video Search) ---
print("⏳ Loading AI Model (BERT)...")
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ AI Model Ready for Universal Search!")
except Exception as e:
    print(f"❌ Error loading AI Model: {e}")
    sys.exit(1)

# --- 3. LOAD COURSE DATA ---
COURSE_DATA = {}
try:
    file_path = os.path.join("data", "courses.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding='utf-8') as f:
            COURSE_DATA = json.load(f)
        print("✅ Course Data Loaded!")
    else:
        print("⚠️ Warning: data/courses.json not found.")
        COURSE_DATA = {}
except Exception as e:
    COURSE_DATA = {} 

# --- MODELS ---
class QueryModel(BaseModel):
    question: str

class QuizRequest(BaseModel):
    class_id: str
    topic_id: int

class ChatRequest(BaseModel):
    message: str

# --- HELPER: KEYWORD EXTRACTOR (For Wiki Backup) ---
def extract_keywords(text):
    ignore = ["how", "to", "what", "is", "explain", "can", "you", "tell", "me", "about", "the", "a", "an", "does", "do", "made", "make", "at", "night"]
    words = re.findall(r'\b\w+\b', text.lower())
    return " ".join([w for w in words if w not in ignore])


# ======================================================
# [A] UNIVERSAL SEARCH ENGINE (FIXED AS PER YOUR REQUEST) ✅
# ======================================================
@app.post("/semantic-search")
def semantic_search(q: QueryModel):
    query = q.question.strip()
    print(f"\n🌍 Universal Search for: {query}")

    # --- 1. ROBUST WIKIPEDIA SEARCH (Updated Logic) ---
    short_note = "Summary not available."
    try:
        print(f"📖 Searching Wikipedia for: '{query}'")
        
        # ১. আগে সার্চ করে সঠিক টাইটেল বের করা
        search_results = wikipedia.search(query)
        
        if search_results:
            # প্রথম রেজাল্টটি হলো সঠিক পেজের নাম
            best_match_title = search_results[0]
            print(f"✅ Wiki Match Found: '{best_match_title}'")
            
            # ২. সেই টাইটেল দিয়ে সামারি আনা
            short_note = wikipedia.summary(best_match_title, sentences=3, auto_suggest=False)
        else:
            short_note = "No Wikipedia article found for this topic."
            
    except wikipedia.exceptions.DisambiguationError as e:
        try:
            short_note = wikipedia.summary(e.options[0], sentences=3, auto_suggest=False)
        except:
            short_note = "Topic is ambiguous. Please be more specific."
    except Exception as e:
        print(f"⚠️ Wiki Error: {e}")
        short_note = "Could not fetch summary from Wikipedia."

    # --- 2. LIVE YOUTUBE SEARCH ---
    try:
        search_query = query + " explanation education"
        results = YoutubeSearch(search_query, max_results=5).to_dict()

        if not results:
            return {"status": "error", "message": "No related videos found."}

        # --- 3. AI RANKING (BERT) ---
        video_titles = [vid['title'] for vid in results]
        
        query_embedding = model.encode(query, convert_to_tensor=True)
        title_embeddings = model.encode(video_titles, convert_to_tensor=True)
        
        scores = util.cos_sim(query_embedding, title_embeddings)[0]
        best_idx = int(scores.argmax())
        
        best_video = results[best_idx]
        confidence = float(scores[best_idx])
        
        print(f"🎥 Best Video Match: {best_video['title']} (Score: {int(confidence*100)}%)")

        # --- 4. TIMESTAMP LOGIC ---
        start_time = 0
        matched_line = "Playing full video lesson."

        try:
            transcript = YouTubeTranscriptApi.get_transcript(best_video['id'])
            texts = [t['text'] for t in transcript]
            starts = [t['start'] for t in transcript]
            
            transcript_emb = model.encode(texts, convert_to_tensor=True)
            t_scores = util.cos_sim(query_embedding, transcript_emb)[0]
            best_t_idx = int(t_scores.argmax())
            
            start_time = int(starts[best_t_idx])
            matched_line = texts[best_t_idx]
            print(f"⏱️ Exact Timestamp Found: {start_time}s")
        except:
            print("⚠️ Transcript unavailable, playing from start.")

        return {
            "status": "success",
            "videoUrl": f"https://www.youtube.com/embed/{best_video['id']}?start={start_time}&autoplay=1",
            "title": best_video['title'],
            "timestamp": start_time,
            "short_note": short_note,
            "matched_line": matched_line,
            "ai_note": f"AI Confidence Score: {int(confidence * 100)}%"
        }

    except Exception as e:
        print(f"❌ Server Error: {e}")
        return {"status": "error", "message": "Could not process request."}


# ======================================================
# [B] TUTOR CHAT (GROQ - NO CHANGES MADE) 🤖
# ======================================================
@app.post("/tutor-chat")
def tutor_chat(req: ChatRequest):
    user_msg = req.message.strip()
    msg_lower = user_msg.lower()
    print(f"💬 Chat Query: {user_msg}")

    # LAYER 1: Free Rules
    rules = {
        "hi": "Hello! I am EduLearn Tutor. How can I help you today? 👋",
        "hello": "Hi there! Ready to learn something new?",
        "hey": "Hey! Ask me any question about Science or Math.",
        "who are you": "I am an AI Tutor powered by Llama 3! 🤖",
        "help": "I can help! Just ask me a specific question.",
        "thanks": "You're welcome! Happy learning! 🎓",
        "bye": "Goodbye! See you next time."
    }
    if msg_lower in rules: return {"reply": rules[msg_lower]}

    # LAYER 2: GROQ AI (Llama 3)
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {
                    "role": "system",
                    "content": "You are 'EduLearn Tutor', a friendly AI teacher for students. Keep answers simple, short (3 sentences), and encouraging."
                },
                {
                    "role": "user",
                    "content": user_msg
                }
            ],
            temperature=0.7,
            max_tokens=200,
        )
        reply = completion.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        print(f"❌ Groq Error: {e}")
        # LAYER 3: Wikipedia Backup
        try:
            clean_q = extract_keywords(user_msg)
            wiki_res = wikipedia.search(clean_q)
            if wiki_res:
                summary = wikipedia.summary(wiki_res[0], sentences=3)
                return {"reply": f"AI is busy, but here is info from Wiki: {summary}"}
        except:
            pass
        return {"reply": "I am having connection issues. Please try again!"}


# [C] CLASS DATA
@app.get("/get-class-data/{class_id}")
def get_class_data(class_id: str):
    class_key = class_id.lower().replace(" ", "_")
    if class_key in COURSE_DATA:
        return {"status": "success", "class": class_id, "videos": COURSE_DATA[class_key]}
    return {"status": "error", "message": "Class not found."}

# [D] QUIZ DATA
@app.post("/get-course-quiz")
def get_course_quiz(req: QuizRequest):
    class_key = req.class_id.lower().replace(" ", "_")
    if class_key in COURSE_DATA:
        topics = COURSE_DATA[class_key]
        topic = next((t for t in topics if t['id'] == req.topic_id), None)
        if topic and "quiz" in topic:
            return {"status": "success", "title": topic['title'], "questions": topic['quiz']}
    return {"status": "error", "message": "Quiz not found."}