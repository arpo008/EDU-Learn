import React, { useState, useEffect } from "react";

const QuizSection = ({ classId, topicId }) => {
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [errorMsg, setErrorMsg] = useState(""); // নতুন এরর স্টেট

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoading(true);
            setErrorMsg(""); // রিসেট
            try {
                // ১. ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
                const res = await fetch("http://127.0.0.1:8001/get-course-quiz", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ class_id: classId, topic_id: Number(topicId) }),
                });
                
                // ২. রেসপন্স চেক করা
                if (!res.ok) throw new Error("Server not responding");
                
                const data = await res.json();
                
                if (data.status === "success" && data.questions && data.questions.length > 0) {
                    setQuizData(data.questions);
                    setCurrentQuestion(0);
                    setScore(0);
                    setShowResult(false);
                } else {
                    setErrorMsg("⚠️ No questions found for this topic.");
                }
            } catch (error) {
                console.error("Quiz Error:", error);
                setErrorMsg("❌ Connection Failed! Make sure 'ai_server.py' is running.");
            }
            setLoading(false);
        };

        if (classId && topicId) {
            fetchQuiz();
        }
    }, [classId, topicId]);

    const handleAnswerClick = (selectedOption) => {
        const isCorrect = selectedOption === quizData[currentQuestion].answer;
        if (isCorrect) setScore(score + 1);

        const nextQ = currentQuestion + 1;
        if (nextQ < quizData.length) {
            setCurrentQuestion(nextQ);
        } else {
            setShowResult(true);
        }
    };

    // --- লোডিং বা এরর হলে কি দেখাবে ---
    if (loading) return (
        <div className="flex flex-col items-center justify-center p-10 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-600 font-medium">Loading Quiz...</p>
        </div>
    );

    if (errorMsg) return (
        <div className="p-8 text-center bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto mt-8">
            <div className="text-4xl mb-3">😕</div>
            <h3 className="text-red-600 font-bold text-lg">{errorMsg}</h3>
            <p className="text-gray-600 text-sm mt-2">Please check if your Python server is running properly.</p>
        </div>
    );

    if (quizData.length === 0) return null;

    // --- মেইন কুইজ UI ---
    return (
        <div className="mt-8 max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-indigo-600 p-5 flex justify-between items-center text-white">
                    <h3 className="font-bold text-xl flex items-center gap-2">📝 Quiz Time</h3>
                    {!showResult && <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Q {currentQuestion + 1}/{quizData.length}</span>}
                </div>

                <div className="p-8">
                    {showResult ? (
                        <div className="text-center py-6">
                            <div className="text-6xl mb-4">{score > quizData.length / 2 ? "🏆" : "🎯"}</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
                            <p className="text-lg text-gray-600 mb-6">You scored <span className="font-bold text-indigo-600 text-2xl">{score}</span> out of {quizData.length}</p>
                            <button onClick={() => { setCurrentQuestion(0); setScore(0); setShowResult(false); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition">Retake Quiz</button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">{quizData[currentQuestion].question}</h2>
                            <div className="grid gap-4">
                                {quizData[currentQuestion].options.map((option, idx) => (
                                    <button key={idx} onClick={() => handleAnswerClick(option)} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-indigo-50 hover:border-indigo-500 hover:text-indigo-700 transition font-medium text-gray-600 flex items-center gap-3">
                                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-bold text-gray-500">{String.fromCharCode(65 + idx)}</span>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizSection;