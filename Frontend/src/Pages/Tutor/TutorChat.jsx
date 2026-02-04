import React, { useState, useEffect, useRef } from "react";

const TutorChat = () => {
    const [messages, setMessages] = useState([
        { 
            sender: "bot", 
            text: "Hello! 👋 I am your EduLearn Tutor Agent. How can I assist you with your studies today? 📚" 
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    // রেফারেন্স চ্যাট কন্টেইনারের জন্য (বডির জন্য নয়)
    const chatContainerRef = useRef(null);

    // ✅ FIX: Scroll only the container, NOT the page
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8001/tutor-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Server connection failed." }]);
        }
        setLoading(false);
    };

    return (
        // ✅ FIX: h-screen and overflow-hidden prevents body scroll
        <div className="h-[calc(100vh-64px)] bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden">
            
            <div className="w-full max-w-2xl h-[600px] flex flex-col bg-[#1e293b] rounded-2xl border border-gray-700 shadow-2xl relative">
                
                {/* Header */}
                <div className="bg-[#1e293b] p-3 flex items-center gap-3 border-b border-gray-700 shadow-md z-10 rounded-t-2xl">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">EA</div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1e293b] rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-md tracking-wide">EduLearn Tutor Agent</h3>
                        <p className="text-green-400 text-[10px] font-medium uppercase tracking-wider">Active Now</p>
                    </div>
                </div>

                {/* ✅ FIX: 'ref' added here to control internal scroll */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0f172a]/40 scroll-smooth"
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                            {msg.sender === "bot" && (
                                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white mr-2 mt-1 shrink-0">EA</div>
                            )}
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                ${msg.sender === "user" 
                                    ? "bg-blue-600 text-white rounded-tr-none" 
                                    : "bg-[#334155] text-gray-200 border border-gray-600 rounded-tl-none"}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start items-center ml-8">
                            <div className="flex gap-1 bg-[#334155] px-3 py-2 rounded-xl rounded-tl-none">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-3 bg-[#1e293b] border-t border-gray-700 rounded-b-2xl">
                    <div className="flex gap-2 items-center bg-[#0f172a] px-4 py-2 rounded-full border border-gray-600 focus-within:border-blue-500 transition-all">
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                            placeholder="Type your topic (e.g., Photosynthesis)..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button onClick={handleSend} disabled={loading || !input.trim()} className="text-blue-500 hover:text-white transition-colors">
                            ➤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorChat;