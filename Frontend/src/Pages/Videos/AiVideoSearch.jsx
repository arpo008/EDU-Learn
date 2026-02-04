import React, { useState } from "react";
import { jsPDF } from "jspdf"; // <--- ১. ইমপোর্ট করা হলো

const AiVideoSearch = () => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAiSearch = async () => {
        if (!query) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("http://127.0.0.1:8001/semantic-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: query }),
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error("AI Server Error:", error);
            alert("Ensure ai_server.py is running on port 8001");
        }
        setLoading(false);
    };

    // --- ২. PDF ডাউনলোড ফাংশন ---
    const handleDownloadPDF = () => {
        if (!result) return;

        const doc = new jsPDF();
        
        // Header Decoration
        doc.setFillColor(15, 23, 42); // Dark Blue Header
        doc.rect(0, 0, 210, 20, 'F');
        
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text("EduLearn AI Smart Notes", 105, 13, { align: "center" });

        // Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Topic: ${result.title}`, 20, 40);

        // Date
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 48);

        // Content (Text Wrapping)
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Summary:", 20, 60);
        
        // নোটটি যদি অনেক বড় হয়, তা যেন পেজের বাইরে না যায়
        const splitText = doc.splitTextToSize(result.short_note, 170);
        doc.setFont("helvetica", "normal");
        doc.text(splitText, 20, 70);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Powered by EduLearn Capstone AI Engine", 105, 280, { align: "center" });

        // Save
        doc.save(`${query}_Smart_Notes.pdf`);
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-10 mb-16 px-14">
            
            {/* Main Dark Card Container */}
            <div className="bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="p-6 md:p-10">
                    {/* Header & Search Section */}
                    <div className="max-w-4xl mx-auto text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 drop-shadow-lg">
                             AI Knowledge Engine
                        </h2>
                        
                        <div className="flex flex-col md:flex-row gap-3 bg-[#1e293b] p-3 rounded-2xl border border-gray-700 shadow-xl transition-all focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
                            <input
                                type="text"
                                className="flex-1 bg-transparent text-white text-lg px-4 py-3 outline-none placeholder-gray-400 w-full"
                                placeholder="Ask about any topic (e.g., Photosynthesis, Gravity)..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                            />
                            <button
                                onClick={handleAiSearch}
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 shadow-lg transform active:scale-95 whitespace-nowrap"
                            >
                                {loading ? "Scanning..." : "Explore 🚀"}
                            </button>
                        </div>
                    </div>

                    {/* ERROR MESSAGE */}
                    {result && result.status === "error" && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center max-w-2xl mx-auto animate-pulse">
                            ❌ {result.message}
                        </div>
                    )}

                    {/* RESULT SECTION */}
                    {result && result.status === "success" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
                            
                            {/* LEFT: Video Player */}
                            <div className="lg:col-span-2 flex flex-col gap-5">
                                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700 relative group ring-1 ring-white/10">
                                    <iframe
                                        src={result.videoUrl}
                                        title="AI Found Video"
                                        className="w-full h-full"
                                        allow="autoplay; encrypted-media; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                
                                <div className="bg-[#1e293b]/80 backdrop-blur-md p-5 rounded-2xl border border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-100">{result.title}</h3>
                                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                                            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded">Context Match</span>
                                            <span className="italic text-sm">"...{result.matched_line.substring(0, 50)}..."</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-purple-300 uppercase tracking-wider font-semibold">Confidence Score</span>
                                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                            {result.ai_note.replace("AI Match Score: ", "")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Notes with Download Button */}
                            <div className="lg:col-span-1 h-full flex flex-col">
                                <div className="bg-gradient-to-b from-[#1e293b] to-[#111827] border border-gray-700 rounded-2xl p-6 shadow-2xl flex-grow flex flex-col relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>

                                    <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-700/50 z-10">
                                        <div className="bg-blue-500/20 p-3 rounded-xl">
                                            <span className="text-2xl">🧠</span>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-blue-100">Smart Notes</h4>
                                            <p className="text-xs text-blue-400/70">Generated via Wikipedia & NLP</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4 z-10 mb-4">
                                        <p className="text-gray-300 leading-relaxed text-[16px] text-justify font-light tracking-wide">
                                            {result.short_note}
                                        </p>
                                    </div>

                                    {/* --- ৩. Download Button --- */}
                                    <button 
                                        onClick={handleDownloadPDF}
                                        className="w-full mt-auto bg-gray-800 hover:bg-gray-700 text-blue-300 border border-gray-600 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 z-10"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 9.75v10.32m0 0l-3-3m3 3l3-3m-7.5-6L13.875 1.875a2.25 2.25 0 014.242 4.242L12 9.75z" />
                                        </svg>
                                        Download Notes (PDF)
                                    </button>

                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiVideoSearch;