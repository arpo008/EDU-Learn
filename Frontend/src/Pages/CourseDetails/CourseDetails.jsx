import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CourseDetails = () => {
    const { classID } = useParams();
    const [subjects, setSubjects] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const className = classID.toLowerCase().replace(/\s+/g, '');
        
        fetch(`http://127.0.0.1:8000/get-class-videos?class_name=${className}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    setSubjects(data.data);
                } else {
                    setError("No videos found for this class.");
                    setSubjects({});
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to connect to backend.");
                setLoading(false);
            });
    }, [classID]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-white">
            <div className="text-2xl text-white font-bold animate-pulse">Loading Course Content...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-white">
            <div className="text-xl text-red-600 bg-white px-6 py-4 rounded-xl shadow-xl font-bold">{error}</div>
        </div>
    );

    return (
        // ১. ব্যাকগ্রাউন্ড কালার ফিক্স করা হয়েছে (তোমার আগের পেজের মতো গ্র্যাডিয়েন্ট)
        <section className="py-12 min-h-screen bg-gradient-to-b from-purple-400 to-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 capitalize drop-shadow-md">
                        {classID} <span className="text-indigo-900">Course Materials</span>
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto">
                        Explore our curated video lessons tailored for your class.
                    </p>
                    <Link to="/course" className="inline-block mt-6 px-6 py-2 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-purple-50 transition-all hover:scale-105">
                        ← Back to All Courses
                    </Link>
                </div>

                {/* Subject Wise Video List */}
                <div className="space-y-12">
                    {Object.keys(subjects).length === 0 && (
                        <div className="text-center bg-white/50 p-10 rounded-2xl backdrop-blur-sm">
                            <p className="text-gray-700 text-xl font-medium">No content available specifically for this class yet.</p>
                        </div>
                    )}

                    {Object.entries(subjects).map(([subject, videos]) => (
                        // ২. সাবজেক্ট কার্ড ডিজাইন আপডেট (সাদা কার্ড, শ্যাডো, বর্ডার)
                        <div key={subject} className="bg-white rounded-3xl shadow-2xl p-8 border border-white/50 relative overflow-hidden">
                            {/* Decorative Background Blob */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -z-0 opacity-50"></div>
                            
                            <h2 className="text-3xl font-bold text-indigo-700 mb-8 border-b-2 border-purple-100 pb-2 inline-block relative z-10">
                                📚 {subject}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                                {videos.map((video, idx) => (
                                    <div key={idx} className="bg-slate-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100 group flex flex-col h-full hover:-translate-y-2">
                                        {/* Video Thumbnail Area */}
                                        <div className="h-44 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden group-hover:from-blue-600 group-hover:to-purple-700 transition-colors">
                                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                            </div>
                                            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                Video
                                            </span>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 leading-snug">
                                                {video.topic}
                                            </h3>
                                            
                                            {/* Segments Info */}
                                            <div className="flex items-center gap-2 mb-5">
                                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                                                    {video.segments ? video.segments.length : 0} Segments
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-auto flex flex-col gap-3">
                                                <a 
                                                    href={video.url} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none w-full shadow-md font-bold"
                                                >
                                                    Watch on YouTube
                                                </a>

                                                <Link 
                                                    to={`/video`} 
                                                    className="btn btn-sm btn-outline border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 w-full"
                                                >
                                                    ✨ Ask AI Agent
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CourseDetails;