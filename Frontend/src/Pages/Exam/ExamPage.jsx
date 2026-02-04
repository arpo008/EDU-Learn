import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuizSection from '../../components/QuizSection';

const ExamPage = () => {
    const { classId } = useParams(); // URL থেকে পাচ্ছে (যেমন: class_7)
    const [selectedTopicId, setSelectedTopicId] = useState(null);

    // সব ক্লাসের টপিক লিস্ট (সহজে বোঝার জন্য এখানে হার্ডকোড করা হলো)
    const allTopics = [
        // Class 6 Topics
        { id: 601, class: "class_6", name: "Math: Knowing Our Numbers" },
        { id: 602, class: "class_6", name: "Math: Whole Numbers" },
        { id: 603, class: "class_6", name: "Science: Components of Food" },
        
        // Class 7 Topics
        { id: 701, class: "class_7", name: "Math: Integers" },
        { id: 702, class: "class_7", name: "Math: Fractions & Decimals" },
        { id: 703, class: "class_7", name: "Science: Nutrition in Plants" },
        { id: 704, class: "class_7", name: "Science: Acids, Bases and Salts" },

        // Class 8 Topics
        { id: 801, class: "class_8", name: "Math: Rational Numbers" },
        { id: 802, class: "class_8", name: "Math: Linear Equations" },
        { id: 803, class: "class_8", name: "Science: Crop Production" },
    ];

    // শুধু বর্তমান ক্লাসের টপিকগুলো ফিল্টার করা
    const currentClassTopics = allTopics.filter(t => t.class === classId);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/exam-dashboard" className="text-indigo-600 font-medium mb-6 inline-flex items-center gap-2 hover:underline">
                    <span>⬅️</span> Back to Dashboard
                </Link>
                
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    ✍️ Exam Portal
                </h1>
                <p className="text-center text-gray-500 mb-10 uppercase tracking-widest font-semibold">
                    {classId?.replace('_', ' ')}
                </p>

                {!selectedTopicId ? (
                    // --- TOPIC SELECTION LIST ---
                    <div className="grid gap-4 max-w-2xl mx-auto animate-fade-in-up">
                        {currentClassTopics.length > 0 ? (
                            currentClassTopics.map(t => (
                                <button 
                                    key={t.id} 
                                    onClick={() => setSelectedTopicId(t.id)}
                                    className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-500 hover:bg-indigo-50 text-left font-semibold text-gray-700 transition flex justify-between items-center group"
                                >
                                    <span>{t.name}</span>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs group-hover:bg-indigo-600 group-hover:text-white transition">Start Exam</span>
                                </button>
                            ))
                        ) : (
                            <div className="text-center p-10 bg-white rounded-xl shadow-sm">
                                <p className="text-gray-500">No topics available for this class yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // --- QUIZ VIEW ---
                    <div className="animate-fade-in">
                        <button 
                            onClick={() => setSelectedTopicId(null)} 
                            className="mb-4 text-sm font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition"
                        >
                            <span>↩</span> Choose Another Topic
                        </button>
                        
                        {/* কুইজ লোড হবে */}
                        <QuizSection classId={classId} topicId={selectedTopicId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamPage;