// src/components/HowItWorks.jsx
import React from "react";
import { motion } from "framer-motion";

// Example icons, replace with yours
const icons = [
    <svg className="w-14 h-14 mx-auto" viewBox="0 0 48 48" fill="none" key="1">
        <rect x="12" y="12" width="24" height="24" rx="6" fill="#3B82F6" />
        <rect x="18" y="18" width="12" height="12" rx="3" fill="#60A5FA" />
    </svg>,
    <svg className="w-14 h-14 mx-auto" viewBox="0 0 48 48" fill="none" key="2">
        <rect x="14" y="20" width="20" height="10" rx="2" fill="#6366F1" />
        <rect x="18" y="17" width="12" height="4" rx="1" fill="#A5B4FC" />
    </svg>,
    <svg className="w-14 h-14 mx-auto" viewBox="0 0 48 48" fill="none" key="3">
        <rect x="14" y="28" width="20" height="6" rx="2" fill="#F59E42" />
        <circle cx="24" cy="24" r="6" fill="#FECA57" />
    </svg>
];

const steps = [
    {
        icon: icons[0],
        num: "01",
        title: "Create Account",
        desc: "Sign up for free and explore our platform",
    },
    {
        icon: icons[1],
        num: "02",
        title: "Choose Courses",
        desc: "Browse and enroll in courses that match your goals",
    },
    {
        icon: icons[2],
        num: "03",
        title: "Start Learning",
        desc: "Access content and get AI help whenever you need it",
    },
];

const iconAnim = {
    animate: {
        y: [0, -12, 0],
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
    }
};

const cardAnim = {
    rest: { scale: 1, zIndex: 1 },
    hover: { scale: 1.07, zIndex: 2, transition: { type: "spring", stiffness: 350 } }
};

const HowItWorks = () => (
    <section className="py-16 bg-gradient-to-b from-purple-400 to-white">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">How It Works</h2>
        <p className="text-center text-lg text-slate-600 mb-9">
            Get started in three simple steps
        </p>
        <div className="flex flex-wrap justify-center gap-6">
            {steps.map((step, idx) => (
                <motion.div
                    key={idx}
                    variants={cardAnim}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="relative bg-white rounded-2xl shadow-lg px-10 py-8 w-[300px] min-h-[330px] flex flex-col items-center transition-all duration-300"
                >
                    <motion.div
                        variants={iconAnim}
                        animate="animate"
                        className="mb-5"
                    >
                        {step.icon}
                    </motion.div>
                    <div className="text-3xl font-semibold text-indigo-500 mb-1">{step.num}</div>
                    <h3 className="text-xl font-medium mb-2 text-gray-900">{step.title}</h3>
                    <p className="text-gray-500 text-center">{step.desc}</p>
                    {/* Right arrow */}
                    {idx !== steps.length - 1 && (
                        <span className="absolute top-1/2 right-[-40px] -translate-y-1/2 text-2xl text-blue-300">
                            &rarr;
                        </span>
                    )}
                </motion.div>
            ))}
        </div>
    </section>
);

export default HowItWorks;
