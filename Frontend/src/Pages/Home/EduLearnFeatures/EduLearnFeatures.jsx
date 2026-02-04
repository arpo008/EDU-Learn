// src/components/EduLearnFeatures.jsx
import React from "react";
import { motion } from "framer-motion";

const features = [
    {
        icon: (
            <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24">
                <rect x="2" y="12" width="6" height="6" rx="2" fill="currentColor" />
                <rect x="16" y="6" width="6" height="6" rx="2" fill="currentColor" />
                <path d="M8 15.5L15 8.5M15 8.5H13M15 8.5V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        title: "AI-Powered Learning",
        desc: "Get instant answers to your questions with our advanced AI assistant.",
        bg: "bg-white",
        hover: "hover:bg-blue-50"
    },
    {
        icon: (
            <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" />
                <path d="M8 8H16M8 12H16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        title: "Expert-Curated Courses",
        desc: "Learn from industry professionals with our comprehensive course library.",
        bg: "bg-purple-50",
        hover: "hover:bg-purple-100"
    },
    {
        icon: (
            <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="9" r="3" fill="currentColor" />
                <ellipse cx="12" cy="17" rx="7" ry="3" fill="currentColor" />
            </svg>
        ),
        title: "Community Support",
        desc: "Join thousands of learners and collaborate on projects together.",
        bg: "bg-white",
        hover: "hover:bg-orange-50"
    },
    {
        icon: (
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24">
                <rect x="6" y="4" width="12" height="16" rx="3" fill="currentColor" />
                <path d="M12 7v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#fff" />
            </svg>
        ),
        title: "Certified Programs",
        desc: "Earn recognized certificates upon completing your courses.",
        bg: "bg-white",
        hover: "hover:bg-green-50"
    },
];

// Framer Motion variants for both card and icon (icon listens for parent hover state)
const cardVariants = {
    initial: { y: 0, boxShadow: "0 1px 6px 0 rgba(80,80,150,0.05)" },
    hover: {
        y: -28,
        boxShadow: "0 12px 32px 0 rgba(80,80,150,0.12)",
        transition: { type: "spring", duration: 0.3 }
    }
};

const iconVariants = {
    initial: { rotate: 0 },
    hover: {
        rotate: 70,
        transition: { type: "spring", stiffness: 200 }
    }
};

const EduLearnFeatures = () => (
    <section className="py-16 bg-purple-400">
        <div className=" mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-3 text-gray-900">
                Why Choose EduLearn?
            </h2>
            <p className="text-center text-lg text-slate-600 mb-10">
                We combine cutting-edge technology with expert instruction to deliver the best learning experience.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        className={`group w-[265px] rounded-2xl p-6 ${feature.bg} ${feature.hover} shadow-md flex flex-col items-start transition-all duration-300`}
                        style={{ minHeight: 232 }}
                    >
                        <motion.div
                            variants={iconVariants}
                            className="mb-4"
                            style={{ willChange: "transform" }}
                        >
                            {feature.icon}
                        </motion.div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-500">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default EduLearnFeatures;
