import React, { useState, useEffect, useRef } from "react";
import { ConvaiClient } from "convai-web-sdk";
import Avatar from "./Avatar"; 

const TutorChat = () => {
    const [messages, setMessages] = useState([
        { 
            sender: "bot", 
            text: "Hello! 👋 I am your EduLearn Tutor. You can type or use the mic to talk to me! 🎤",
            isWelcome: true 
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    // 🌟 নতুন স্টেটস
    const [isTalking, setIsTalking] = useState(false); 
    const [isRecording, setIsRecording] = useState(false); // মাইক অন/অফ ট্র্যাক করার জন্য
    
    const chatContainerRef = useRef(null);
    const convaiClient = useRef(null);
    const isInitialized = useRef(false); 

    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        console.log("🚀 Initializing Convai Client...");
        
        try {
            convaiClient.current = new ConvaiClient({
                apiKey: import.meta.env.VITE_character_API, 
                characterId: import.meta.env.VITE_characterId, 
                enableAudio: true, 
            });

            convaiClient.current.setErrorCallback?.((type, statusMessage) => {
                console.error("🔴 Convai Internal Error:", type, statusMessage);
            });

            convaiClient.current.setResponseCallback((response) => {
                
                // 🌟 ১. ইউজারের ভয়েস হ্যান্ডলিং (আলাদা বক্স না বানিয়ে এক বক্সে আপডেট করা)
                if (response.hasUserQuery && response.hasUserQuery()) {
                    const uq = response.getUserQuery();
                    const userText = uq?.getTextData ? uq.getTextData() : "";
                    const isFinal = uq?.getIsFinal ? uq.getIsFinal() : false;

                    if (userText) {
                        setMessages(prev => {
                            const newMsgs = [...prev];
                            const lastMsg = newMsgs[newMsgs.length - 1];

                            // যদি আগের মেসেজটি ইউজারের ভয়েস হয় এবং এখনো প্রসেসিং চলে
                            if (lastMsg && lastMsg.sender === "user" && lastMsg.isStreaming) {
                                newMsgs[newMsgs.length - 1] = { ...lastMsg, text: userText, isStreaming: !isFinal };
                                return newMsgs;
                            } else {
                                // একদম নতুন কথা শুরু হলে
                                return [...newMsgs, { sender: "user", text: userText, isStreaming: !isFinal }];
                            }
                        });
                        setLoading(true);
                    }
                }
                
                // 🌟 ২. এআই এর রিপ্লাই এবং লিপ-সিংক হ্যান্ডলিং
                if (response.hasAudioResponse && response.hasAudioResponse()) {
                    const audio = response.getAudioResponse();
                    const botText = audio?.getTextData ? audio.getTextData() : "";
                    
                    if (botText) {
                        setMessages(prev => {
                            const newMessages = [...prev];
                            const lastIndex = newMessages.length - 1;
                            const lastMsg = newMessages[lastIndex];

                            if (lastMsg && lastMsg.sender === "bot" && !lastMsg.isWelcome) {
                                newMessages[lastIndex] = { 
                                    ...lastMsg, 
                                    text: lastMsg.text + " " + botText 
                                };
                                return newMessages;
                            } else {
                                return [...newMessages, { sender: "bot", text: botText }];
                            }
                        });

                        // এআই এর কথা বলা শুরু
                        setIsTalking(true);
                        
                        // কথা বলার সময় বাড়ানো হলো (প্রতি অক্ষরের জন্য ১১০ মি.সে. + অতিরিক্ত ২ সেকেন্ড)
                        const speakingDuration = (botText.length * 110) + 2000; 
                        
                        if (window.talkTimeout) clearTimeout(window.talkTimeout);
                        
                        window.talkTimeout = setTimeout(() => {
                            setIsTalking(false);
                        }, speakingDuration);
                    }
                    setLoading(false);
                }
            });

            // Convai এর ডিফল্ট ইভেন্টগুলো অনেক সময় আগে ফায়ার হয়ে যায়, তাই সেগুলো রিমুভ করে ম্যানুয়াল টাইমার ব্যবহার করা হলো।

        } catch (error) {
            console.error("❌ Convai Init Error:", error);
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendText = () => {
        if (!input.trim() || !convaiClient.current) return;
        
        // টাইপ করা মেসেজ সরাসরি ফাইনাল
        setMessages(prev => [...prev, { sender: "user", text: input, isStreaming: false }]);
        setLoading(true);
        
        try {
            if (typeof convaiClient.current.sendTextChunk === "function") {
                convaiClient.current.sendTextChunk(input);
            } else if (typeof convaiClient.current.sendText === "function") {
                convaiClient.current.sendText(input);
            }
        } catch (err) {
            console.error("❌ Send Error Catch Block:", err);
            setLoading(false);
        }
        
        setInput("");
    };

    // 🌟 ৩. নতুন মাইক বাটন লজিক (Click to Talk / Click to Stop)
    const toggleRecording = async () => {
        if (!convaiClient.current) return;

        if (isRecording) {
            convaiClient.current.endAudioChunk();
            setIsRecording(false);
        } else {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                convaiClient.current.startAudioChunk();
                setIsRecording(true);
            } catch (error) {
                console.error("❌ Mic access denied by Mac/Browser:", error);
                alert("দয়া করে ব্রাউজারের Lock (🔒) আইকনে ক্লিক করে Microphone Allow করুন!");
            }
        }
    };

    return (
        <div className="relative w-full h-[calc(100vh-64px)] bg-[#0f172a] overflow-hidden">
            
            <Avatar isTalking={isTalking} />

            <div className="absolute inset-0 z-10 flex flex-col pointer-events-none justify-between">

                <div className="p-4 md:px-8 pointer-events-auto bg-gradient-to-b from-[#0f172a]/80 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/10">EA</div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#1e293b] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-md">EduLearn Tutor</h3>
                            <p className="text-green-400 text-xs font-semibold uppercase tracking-wider drop-shadow-md">Active Now</p>
                        </div>
                    </div>
                </div>

                <div ref={chatContainerRef} className="flex-1 p-4 md:pl-8 md:pr-10 overflow-y-auto scroll-smooth pointer-events-auto w-full md:w-1/2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in mb-3`}>
                            <div className={`max-w-[85%] p-4 rounded-3xl text-[15px] leading-relaxed shadow-xl backdrop-blur-md
                                ${msg.sender === "user" 
                                    ? "bg-blue-600/85 text-white rounded-tr-sm" 
                                    : "bg-[#1e293b]/85 text-gray-100 border border-gray-500/30 rounded-tl-sm"}`}>
                                
                                {msg.text}
                                
                                {/* 🌟 কথা বলার সময় লোডিং এনিমেশন */}
                                {msg.isStreaming && <span className="ml-2 animate-pulse text-blue-300">...</span>}
                            </div>
                        </div>
                    ))}
                    
                    {loading && !isRecording && (
                        <div className="flex justify-start items-center mb-3">
                            <div className="flex gap-2 bg-[#1e293b]/85 backdrop-blur-md px-5 py-4 rounded-3xl rounded-tl-sm border border-gray-500/30 shadow-xl">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 md:p-8 pointer-events-auto flex justify-center w-full bg-gradient-to-t from-[#0f172a]/90 to-transparent">
                    <div className="flex gap-3 items-center bg-[#1e293b]/80 backdrop-blur-xl w-full max-w-4xl px-4 py-3 rounded-full border border-gray-500/40 shadow-2xl focus-within:border-blue-500/70 transition-all">
                        
                        {/* 🌟 আপডেট করা মাইক বাটন */}
                        <button 
                            onClick={toggleRecording}
                            className={`p-3 rounded-full transition-all duration-300 ${isRecording ? "bg-green-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)] scale-110" : "bg-gray-700/60 text-gray-300 hover:bg-gray-600"}`}
                            title={isRecording ? "Click to Stop" : "Click to Start"}
                        >
                            {isRecording ? "⏹" : "🎤"}
                        </button>

                        <input 
                            type="text" 
                            className="flex-1 bg-transparent text-white text-[16px] placeholder-gray-400 focus:outline-none px-2"
                            placeholder={isRecording ? "Listening... (Click stop when done)" : "Type or click mic to speak..."}
                            value={input}
                            disabled={isRecording}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                        />
                        
                        <button onClick={handleSendText} disabled={loading || !input.trim() || isRecording} className="p-3 text-blue-400 hover:text-white hover:bg-blue-600 rounded-full transition-all disabled:opacity-50 disabled:hover:bg-transparent">
                            ➤
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default TutorChat;