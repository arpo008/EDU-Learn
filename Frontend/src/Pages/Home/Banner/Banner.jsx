// import React from 'react';
// import { Carousel } from 'react-responsive-carousel';
// import "react-responsive-carousel/lib/styles/carousel.min.css";

// const Banner = () => {
//     return (
//        <Carousel autoPlay={true} infiniteLoop={true}>
//                 <div>
//                     <img src="/images/Gemini_Generated_Image_j4mg62j4mg62j4mg.png" />
//                     <p className="legend">Legend 1</p>
//                 </div>
//                 <div>
//                     <img src="assets/2.jpeg" />
//                     <p className="legend">Legend 2</p>
//                 </div>
//                 <div>
//                     <img src="assets/3.jpeg" />
//                     <p className="legend">Legend 3</p>
//                 </div>
//             </Carousel>
//     );
// };

// export default Banner;

// src/components/Banner.jsx
import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

// Helper for motion effects
const floatAnim = {
    initial: { y: 0 },
    animate: { y: [0, -24, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
    whileHover: { scale: 1.16, rotate: 9 },
};

const Banner = () => {
    return (
        <section className="relative min-h-[400px] flex items-center rounded-b-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 overflow-hidden p-8">
            {/* 50K+ Students Badge */}
            <div className="absolute right-8 top-8 flex flex-col items-center z-10">
                <div className="bg-gradient-to-b from-orange-400 to-yellow-400 rounded-xl px-6 py-4 shadow-lg flex flex-col items-center">
                    {/* Icon could be an SVG here */}
                    <svg width="36" height="36" viewBox="0 0 32 32" fill="none"><path d="M26 12.5C26 8.63401 22.866 5.5 19 5.5C15.134 5.5 12 8.63401 12 12.5C12 17.4038 19 26.5 19 26.5C19 26.5 26 17.4038 26 12.5Z" fill="white" /></svg>
                    <div className="text-white text-2xl font-bold mt-2">000+</div>
                    <div className="text-white text-xs">Students</div>
                </div>
            </div>

            {/* Banner Content */}
            <div className="z-10 max-w-2xl">
                <button className="bg-blue-800/60 text-white px-5 py-2 rounded-full mb-8 flex items-center gap-2 hover:bg-blue-900 transition">
                    <span className="text-yellow-300">✨</span> Transform Your Future Today
                </button>
                <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
                    Unlock Your Potential<br />
                    with <span className="text-yellow-300">Quality Education</span>
                </h1>
                <p className="text-lg text-blue-100 mb-8">
                    Access world-class courses and get instant help from our AI-powered learning assistant. Start your journey today.
                </p>
                <div className="flex gap-4">
                    <NavLink to="/course" className="bg-white text-blue-800 px-6 py-3 rounded-lg shadow-md font-medium flex items-center gap-2 hover:bg-blue-50 transition">
                        Browse Courses <span>&rarr;</span>
                    </NavLink>
                </div>
            </div>

            {/* Animated/Floating 3D Icons */}
            <motion.img
                src="/images/dimensions.png"
                alt="cube"
                className="absolute rounded-full right-1/3 top-8 w-24 opacity-80 z-0"
                {...floatAnim}
            />
            <motion.img
                src="/images/3d-modeling.png"
                alt="laptop"
                className="absolute rounded-full right-1/4 top-28 w-24 opacity-90 z-0"
                initial={{ x: 0 }}
                animate={{ x: [0, 16, -16, 0], y: [0, -12, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                whileHover={{ scale: 1.2, rotate: -9 }}
            />
            <motion.img
                src="/images/student.png"
                alt="book"
                className="absolute right-20 rounded-full bottom-8 w-28 opacity-90 z-0"
                initial={{ y: 0 }}
                animate={{ y: [0, 14, -14, 0], transition: { repeat: Infinity, duration: 3.2, ease: "easeInOut" } }}
                whileHover={{ scale: 1.13, rotate: 6 }}
            />
            <motion.img
                src="/images/instructions.png"
                alt="medal"
                className="absolute rounded-full left-2/3 bottom-16 w-24 opacity-90 z-0"
                {...floatAnim}
            />
        </section>
    );
};

export default Banner;
