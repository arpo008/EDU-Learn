import React, { useState } from "react";
import AiVideoSearch from "./AiVideoSearch";

const defaultVideoUrl = "https://www.youtube.com/embed/MC2XbQwQpHQ?start=0";
const suggestions = [
    { q: "What is photosynthesis?", label: "photosynthesis" },
    { q: "Explain Pythagoras theorem", label: "Pythagoras" },
    { q: "What is an atom?", label: "atom" },
    { q: "Describe erosion", label: "erosion" },
];

const topicKeywords = {
    'photosynthesis': 'Biology - Photosynthesis',
    'plant': 'Biology - Plants',
    'pythagor': 'Math - Geometry (Pythagoras)',
    'triangle': 'Math - Triangles',
    'atom': 'Chemistry - Basic atom',
    'speed': 'Physics - Kinematics',
    'velocity': 'Physics - Kinematics',
    'erosion': 'Geography - Erosion & Weathering',
    'fraction': 'Math - Fractions',
    'probab': 'Math - Probability',
};

function detectTopic(text) {
    const t = text.toLowerCase();
    for (const k in topicKeywords) if (t.includes(k)) return topicKeywords[k];
    if (t.includes('who') || t.includes('when') || t.includes('where')) return 'Social Studies / History';
    if (t.split(' ').length < 6) return 'General Knowledge';
    return 'Misc / General Science';
}

function generateExplanation(question, topic) {
    if (topic.includes('Photosynthesis')) return "Photosynthesis is how green plants make their own food using sunlight. They take in sunlight, carbon dioxide (from the air), and water (from the soil). Inside leaves there are tiny things called chloroplasts which use the sunlight like a kitchen to turn the water and carbon dioxide into sugar (which is food) and oxygen (which goes out into the air). Think of the plant as a little chef making food when the sun is out.";
    if (topic.includes('Pythagoras')) return "Pythagoras theorem is an easy rule for right-angled triangles. It says: 'the square of the longest side (the hypotenuse) equals the sum of the squares of the other two sides.' If the two short sides are a and b and the long side is c, then a² + b² = c². You can use it to find one side when you know the other two.";
    if (topic.includes('atom')) return "An atom is the tiny building block of everything around us. It has a center called the nucleus (made of protons and neutrons) and electrons that move around the nucleus. Atoms join together to make molecules, and molecules make materials like water, air, and your pencil.";
    if (topic.includes('Kinematics') || topic.includes('Physics')) return "Speed tells how fast something moves (like '10 km every hour'). Velocity is similar but also says which direction it moves (like '10 km/h north'). So velocity includes direction while speed does not.";
    const short = question.length > 140 ? question.slice(0, 140) + '...' : question;
    return `Question: "${short}"\n\nShort explanation: This is a topic about ${topic}. A simple explanation is: try to break the idea into smaller parts, use an example a 12-year-old can picture, and link it to something they already know. (This is a demo — connect to your LLM backend to get longer tailored answers.)`;
}

function youtubeIdFromUrl(url) {
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
        if (u.searchParams.get('v')) return u.searchParams.get('v');
        return null;
    } catch { return null; }
}

export default function Videos() {
    const [question, setQuestion] = useState("");
    const [topic, setTopic] = useState("—");
    const [explanation, setExplanation] = useState("Kid-friendly explanation will appear here");
    const [videoUrl, setVideoUrl] = useState("");
    const [embed, setEmbed] = useState({
        src: defaultVideoUrl,
        meta: "No video suggested"
    });

    function handleExplain() {
        if (!question.trim()) { setExplanation("Please type a question to explain."); return; }
        const detected = detectTopic(question);
        setTopic(detected);
        setExplanation("Thinking... (demo)");
        setTimeout(() => {
            setExplanation(generateExplanation(question, detected));
            if (detected.toLowerCase().includes('photosynthesis')) setVideoEmbed('https://www.youtube.com/watch?v=UPBMG5EYydo', 12, "Photosynthesis — Khan Academy (demo)");
            else if (detected.toLowerCase().includes('pythagoras') || detected.toLowerCase().includes('geometry')) setVideoEmbed('https://www.youtube.com/watch?v=Ajt8rEz6Qpc', 8, "Pythagorean theorem — Khan Academy (demo)");
            else if (detected.toLowerCase().includes('physics')) setVideoEmbed('https://www.youtube.com/watch?v=Q2e3j6G7q3I', 4, "Speed vs velocity — Demo");
            else setEmbed(e => ({ ...e, meta: "No specific video suggested. Paste a YouTube/Khan Academy URL to override." }));
        }, 700);
    }

    function setVideoEmbed(url, startSeconds = 0, title = 'Suggested video') {
        const id = youtubeIdFromUrl(url);
        if (!id) return;
        setEmbed({
            src: `https://www.youtube.com/embed/${id}?start=${startSeconds}`,
            meta: `${title} • start ${startSeconds}s`
        });
        setVideoUrl(url);
    }

    function handleClear() {
        setQuestion("");
        setTopic("—");
        setExplanation("Kid-friendly explanation will appear here");
        setEmbed({ src: defaultVideoUrl, meta: "No video suggested" });
        setVideoUrl("");
    }

    function handleVideoSuggest() {
        setVideoEmbed("https://www.youtube.com/watch?v=MC2XbQwQpHQ", 0, "Khan Academy demo playlist");
    }

    function handleOpenYoutube() {
        if (!videoUrl) { alert("No video URL provided — use suggested video or paste a YouTube/Khan Academy URL."); return; }
        window.open(videoUrl, "_blank");
    }

    function handlePlayAtTimestamp() {
        if (!videoUrl) { alert("No video URL provided."); return; }
        const id = youtubeIdFromUrl(videoUrl);
        if (!id) { alert("Could not parse the URL. Make sure it is a YouTube link (or a Khan Academy link)."); return; }
        const m = embed.meta.match(/start (\d+)s/);
        const start = m ? parseInt(m[1], 10) : 0;
        setEmbed({ ...embed, src: `https://www.youtube.com/embed/${id}?start=${start}` });
    }

    return (
        // Root Container (Flex Column) to stack sections nicely
        <div className="w-full flex flex-col gap-10 pb-20">

            {/* SECTION 1: Manual Question & Explain Tool (Old Layout) */}
            <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_420px] gap-7 items-start mt-6 px-4">
                
                {/* Main column */}
                <main className="flex flex-col gap-5">
                    <div className="rounded-2xl p-6 bg-[#0b1220] bg-gradient-to-b from-[#0f1724] to-[#101929] shadow-xl border border-white/5">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-3">
                            <div>
                                <strong className="text-[16px] text-blue-100">Ask a question</strong>
                                <div className="flex gap-2 mt-1 text-xs text-blue-300 items-center">
                                    <span>Type a Grade 6–8 style question</span>
                                    <span className="bg-slate-800/60 px-3 py-1 rounded-full text-xs border border-white/5 ml-2 text-blue-400">Explain</span>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center text-xs text-blue-400">
                                <span className="bg-slate-800/40 px-3 py-1 rounded-full border border-white/5">Stack: HTML/CSS/JS</span>
                                <span className="bg-slate-800/40 px-3 py-1 rounded-full border border-white/5">Age: 11–14</span>
                            </div>
                        </div>
                        {/* Input and controls */}
                        <div className="flex gap-3 items-center my-2 flex-wrap">
                            <textarea
                                className="flex-1 bg-white/5 rounded-lg border border-white/10 p-3 text-blue-100 min-h-[88px] text-[15px] resize-y"
                                placeholder="e.g. What is the difference between speed and velocity? Explain like I'm 12."
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                            />
                            <div className="flex flex-col gap-3">
                                <button className="bg-gradient-to-b from-blue-400 to-blue-600 text-[#021027] font-bold shadow px-4 py-2 rounded-lg" onClick={handleExplain}>Explain</button>
                                <button className="bg-transparent border border-white/10 text-blue-300 font-bold px-4 py-2 rounded-lg" onClick={handleClear}>Clear</button>
                            </div>
                        </div>
                        {/* Explanation & detected topic */}
                        <div className="mt-3 flex flex-col gap-2">
                            <div className="flex gap-2 items-center text-blue-300 text-xs">
                                <strong>Detected topic:</strong>
                                <span className="ml-2 text-sky-400 font-semibold">{topic}</span>
                            </div>
                            <div className="bg-black/20 border border-white/10 rounded-lg p-4 text-[15px] leading-relaxed min-h-[120px]">
                                <h3 className="font-bold mb-1 text-base">Kid-friendly explanation will appear here</h3>
                                <div className="text-blue-200">{explanation}</div>
                            </div>
                            {/* Suggestions row */}
                            <div className="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center mt-2">
                                <div className="flex gap-2 flex-wrap">
                                    {suggestions.map(s => (
                                        <button key={s.label}
                                            className="bg-transparent border border-white/10 px-3 py-2 rounded-lg text-blue-300 hover:bg-white/5 text-sm"
                                            onClick={() => setQuestion(s.q)}
                                        >{s.label}</button>
                                    ))}
                                </div>
                                <button className="bg-transparent border border-white/10 text-blue-300 font-bold px-4 py-2 rounded-lg mt-2 md:mt-0" onClick={handleVideoSuggest}>Suggest Video</button>
                            </div>
                        </div>
                    </div>
                    {/* Extra integration notes as inline card */}
                    <div className="rounded-2xl p-5 shadow-md bg-[#0b1220] border border-white/5">
                        <strong>Notes for integration</strong>
                        <ul className="list-disc ml-6 text-blue-400 text-sm mt-1">
                            <li>Replace the client-side stub with API calls to your FastAPI backend for real LLM explanations.</li>
                            <li>Backend should return: {'{ topic, explanation_html, khan_video_url, start_seconds }'}</li>
                            <li>This demo shows how to embed a tagged timestamped video and display explanations for class 6–8 students.</li>
                        </ul>
                    </div>
                </main>

                {/* Right column */}
                <aside className="flex flex-col gap-5">
                    <div className="rounded-2xl p-5 shadow-md bg-[#0b1220] border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                            <strong className="text-blue-100">Khan Academy video (demo)</strong>
                            <span className="bg-slate-800/40 px-3 py-1 rounded-full border border-white/10 text-xs text-blue-300">video embed</span>
                        </div>
                        <div className="rounded-lg overflow-hidden mb-2">
                            <iframe src={embed.src} title="Khan demo" allowFullScreen className="w-full h-60 bg-black"></iframe>
                        </div>
                        <div className="flex justify-between items-center text-xs text-blue-400 mt-1">
                            <span>{embed.meta}</span>
                            <div className="flex gap-2">
                                <button className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-blue-300" onClick={handleOpenYoutube}>Open on YouTube</button>
                                <button className="bg-gradient-to-b from-blue-400 to-blue-600 text-[#021027] rounded-lg px-3 py-2 font-bold" onClick={handlePlayAtTimestamp}>Play from timestamp</button>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl p-5 shadow-md bg-[#0b1220] border border-white/5">
                        <strong className="text-blue-100">Controls</strong>
                        <div className="mt-2 text-blue-400 text-sm">
                            <p className="my-1">You can paste a Khan Academy (YouTube) URL into the prompt or use the suggested videos button.</p>
                            <input
                                className="w-full p-2 rounded-md bg-white/5 text-blue-100 border border-white/10"
                                placeholder="Paste video URL (YouTube)"
                                value={videoUrl}
                                onChange={e => setVideoUrl(e.target.value)}
                            />
                        </div>
                    </div>
                </aside>
            </div>

            {/* SECTION 2: NEW AI SEARCH ENGINE (Full Width) */}
            
            <div className="w-full">
                <AiVideoSearch />
            </div>

        </div>
    );
}