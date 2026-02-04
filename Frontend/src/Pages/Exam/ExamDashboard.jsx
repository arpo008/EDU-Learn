import React from 'react';
import { Link } from 'react-router-dom';

const ExamDashboard = () => {
    const classes = [
        { id: "class_6", name: "Class 6", desc: "Math, Science, English", color: "from-blue-400 to-blue-600" },
        { id: "class_7", name: "Class 7", desc: "Algebra, Geometry, Physics", color: "from-purple-400 to-purple-600" },
        { id: "class_8", name: "Class 8", desc: "Advanced Topics", color: "from-pink-400 to-pink-600" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">🎓 Exam Portal</h1>
                <p className="text-gray-600 mb-12">Select your class to enter the quiz dashboard</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {classes.map((cls) => (
                        <Link to={`/exam/${cls.id}`} key={cls.id} className="group">
                            <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${cls.color} text-white shadow-xl transform transition hover:-translate-y-2 hover:shadow-2xl`}>
                                <div className="text-6xl mb-4">📚</div>
                                <h2 className="text-3xl font-bold mb-2">{cls.name}</h2>
                                <p className="text-white/80">{cls.desc}</p>
                                <button className="mt-6 bg-white text-gray-800 px-6 py-2 rounded-full font-bold group-hover:bg-gray-100 transition">
                                    Start Exam
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExamDashboard;