// src/components/AiLearningAssistant.jsx
import React, { useState } from "react";

// Dummy initial message and suggested questions
const initialMessages = [
    {
        user: false,
        text: "Welcome to AI Learning Assistant!\nAsk me anything about your studies, and I'll help you understand complex topics."
    }
];

const suggestions = [
    "Explain the concept of recursion in programming",
    "What are the differences between React and Vue?",
    "How does machine learning work?",
    "What is the best way to learn Python?",
];

const mockAiResponse = q => {
    if (/react.*vue/i.test(q)) {
        return `React and Vue are both popular JavaScript frameworks for building user interfaces.
- React is developed by Facebook, uses JSX, puts logic and markup together, and has a huge ecosystem.
- Vue is developed by an independent group, uses directives/templates, keeps logic/markup more separate, and is a bit simpler for small projects.
Both are great for modern UIs!`;
    }
    if (/recursion/i.test(q)) {
        return "Recursion in programming refers to a function calling itself to solve smaller instances of a problem, usually with a base case to stop the calls.";
    }
    if (/machine.*learning/i.test(q)) {
        return "Machine learning is a subfield of AI where computers learn from data to make predictions or decisions without being explicitly programmed for each task.";
    }
    if (/learn.*python/i.test(q)) {
        return "The best way to learn Python is by practicing coding exercises, building projects, and using free resources like official docs, YouTube, and online courses.";
    }
    return "Thank you for your question! (This is a mock AI response for demonstration.)";
};

const AiLearningAssistant = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");

    // Simulate AI reply
    const sendMessage = (msg) => {
        setMessages([...messages, { user: true, text: msg }]);
        setTimeout(() => {
            const reply = mockAiResponse(msg);
            setMessages(m => [...m, { user: false, text: reply }]);
        }, 700);
        setInput("");
    };

    return (
        <section className="bg-gradient-to-b from-purple-400 to-white min-h-[520px] py-12 px-2 flex flex-col items-center">
            <div className="mb-3 flex items-center gap-2 justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-400 via-indigo-400 to-green-400 shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <h2 className="text-3xl text-black font-bold bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 bg-clip-text ">
                    AI Learning Assistant
                </h2>
            </div>
            <p className="text-center text-black mb-7">
                Ask any question and get instant, intelligent answers powered by AI
            </p>
            <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full mx-auto">
                {/* Chat Box */}
                <div className="bg-white rounded-2xl shadow-md flex-1 p-5 flex flex-col min-h-[340px]">
                    <div className="text-gray-800 font-medium mb-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-700" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                        </span>
                        Chat with AI
                    </div>
                    <div className="flex-1 overflow-y-auto border rounded bg-blue-50 px-3 py-4 mb-3" style={{ minHeight: 160 }}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`mb-4 ${msg.user ? 'flex justify-end' : 'flex justify-start'}`}
                            >
                                <div className={`px-4 py-2 rounded-lg max-w-[95%] text-base border whitespace-pre-line
                                    ${msg.user
                                        ? "bg-indigo-500 text-white border-indigo-400"
                                        : "bg-white text-gray-900 border-gray-300"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form
                        className="flex items-center gap-2"
                        onSubmit={e => {
                            e.preventDefault();
                            if (input.trim()) sendMessage(input);
                        }}
                    >
                        <input
                            className="flex-1 border bg-blue-50 text-gray-900 focus:bg-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-indigo-300 transition"
                            placeholder="Type your question here…"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                            type="submit"
                        >
                            <svg className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24">
                                <path d="M3 20l18-8-18-8v6l15 2-15 2v6z" fill="currentColor" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6 w-full md:max-w-xs">
                    {/* Suggested questions */}
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="text-yellow-400">💡</span> Suggested Questions
                        </h3>
                        <div className="flex flex-col gap-2">
                            {suggestions.map((q, i) => (
                                <button
                                    key={q}
                                    className={`text-left text-sm p-2 rounded-lg border transition hover:bg-indigo-50 text-gray-700 ${input === q ? 'border-indigo-500 bg-indigo-50' : 'border-transparent bg-white'}`}
                                    onClick={() => {
                                        setInput(q);
                                        sendMessage(q);
                                    }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Capabilities */}
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="font-semibold text-black mb-3">AI Capabilities</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-gray-600"><span className="bg-blue-100  rounded-full p-2">💻</span> Code Examples</li>
                            <li className="flex items-center gap-2 text-gray-600"><span className="bg-purple-100 text-purple-600 rounded-full p-2">🧠</span> Concept Explanation</li>
                            <li className="flex items-center gap-2 text-gray-600"><span className="bg-orange-100 text-orange-600 rounded-full p-2">🛠️</span> Problem Solving</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AiLearningAssistant;
