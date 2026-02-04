import React, { useState } from "react";
import { Link } from "react-router-dom";

const courses = [
    {
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
        title: "Class 6",  // Slug will be 'class6' -> Matches Backend
        category: "General",
        trending: true,
        badge: "Foundation",
        description: "Complete curriculum for Class 6 including Math (Numbers), Science (Food), and English basics.",
        duration: "12 months",
        students: 1240,
        rating: 4.8,
        price: "Free"
    },
    {
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop",
        title: "Class 7", // Slug will be 'class7' -> Matches Backend
        category: "Science",
        trending: true,
        badge: "Intermediate",
        description: "Master 7th-grade concepts: Integers in Math, Plant Nutrition in Science, and Grammar.",
        duration: "12 months",
        students: 890,
        rating: 4.9,
        price: "Free"
    },
    {
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop",
        title: "Class 8", // Slug will be 'class8' -> Matches Backend
        category: "Math",
        trending: false,
        badge: "JSC Prep",
        description: "Preparation for Class 8 exams covering Rational Numbers, Crop Production, and Tenses.",
        duration: "12 months",
        students: 2100,
        rating: 4.7,
        price: "Free"
    },
];

const badgeColors = {
    Foundation: "bg-green-500",
    Intermediate: "bg-blue-500",
    "JSC Prep": "bg-purple-500"
};

// ক্যাটাগরিগুলো স্কুলের সাবজেক্ট অনুযায়ী আপডেট করা হলো
const categories = ["All", "General", "Science", "Math", "English"];

const CourseMaterial = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredCourses = selectedCategory === "All"
        ? courses
        : courses.filter(
            course =>
                course.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
        );

    return (
        <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-indigo-700 mb-3">
                    Academic Courses
                </h2>
                <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                    Select your class to access video lessons, smart notes, and AI-powered quizzes tailored for your curriculum.
                </p>
                
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 justify-center mb-10">
                    {categories.map((cat, i) => (
                        <button
                            key={i}
                            className={`px-6 py-2 rounded-full shadow-sm font-medium transition-all transform hover:scale-105
                                ${cat === selectedCategory 
                                    ? "bg-indigo-600 text-white shadow-indigo-300/50 shadow-lg" 
                                    : "bg-white text-gray-600 hover:bg-indigo-50 border border-gray-100"}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Courses Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => {
                        // Logic: "Class 6" -> "class6" (Backend এ এই ID দিয়েই ডেটা আছে)
                        const classSlug = course.title.replace(/\s+/g, '').toLowerCase();
                        
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {course.trending && (
                                        <span className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                                            🔥 Trending
                                        </span>
                                    )}
                                    <span className={`absolute top-4 right-4 px-3 py-1 text-xs text-white rounded-full font-bold shadow-sm ${badgeColors[course.badge] || 'bg-gray-500'}`}>
                                        {course.badge}
                                    </span>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                                            {course.category}
                                        </span>
                                        <span className="text-yellow-500 font-bold text-sm flex items-center gap-1">
                                            ⭐ {course.rating}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors">
                                        {course.title}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">
                                        {course.description}
                                    </p>
                                    
                                    <div className="flex items-center text-xs text-gray-400 gap-4 mb-4 pt-4 border-t border-gray-100">
                                        <span className="flex items-center gap-1">🕒 {course.duration}</span>
                                        <span className="flex items-center gap-1">👨‍🎓 {course.students} Students</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-2xl font-bold text-gray-800">{course.price}</span>
                                        
                                        {/* Enroll Button -> Links to /course-details/class6 */}
                                        <Link 
                                            to={`/course-details/${classSlug}`} 
                                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2"
                                        >
                                            Start Learning 🚀
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-3 py-20 text-center">
                            <p className="text-xl text-gray-400 font-medium">No courses found for this category.</p>
                            <button onClick={() => setSelectedCategory("All")} className="mt-4 text-indigo-600 hover:underline">Clear Filters</button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CourseMaterial;