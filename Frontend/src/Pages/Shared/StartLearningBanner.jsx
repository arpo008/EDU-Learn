// src/components/StartLearningBanner.jsx
import React from "react";

const StartLearningBanner = () => (
    <section className="w-full py-16 flex items-center justify-center bg-gradient-to-b from-white to-purple-400">
        <div className="text-center w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Ready to Start Learning?
            </h2>
            <p className="text-black text-md md:text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of students already learning with EduLearn. Get started today and transform your career.
            </p>
            <button
                className="bg-blue-800 text-black font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-100 transition font-medium flex items-center gap-2 mx-auto"
            >
                Get Started Now <span>→</span>
            </button>
        </div>
    </section>
);

export default StartLearningBanner;
