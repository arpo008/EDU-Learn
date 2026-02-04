// src/components/QuoteCardSection.jsx
import React from "react";
import { Link } from "react-router-dom"; // 1. Link ইমপোর্ট করা হলো

const cards = [
    {
        quote: "Success is the sum of small efforts repeated day in and day out",
        img: "https://i.ibb.co/qFJ2fRQ/stephanie-hau-k-MJhu-PLEYVI-unsplash.jpg", 
    },
    {
        quote: "Education is the most powerful weapon you can use to change the world",
        img: "https://i.ibb.co/dcwXnDY/ying-ge-Yo1c-WJVKFY-unsplash.jpg",
    },
    {
        quote: "The beautiful thing about learning is that no one can take it away from you",
        img: "https://i.ibb.co/JkpNLGK/3111718052122.jpg",
    },
];

const Card = () => (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-purple-400">
        <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-3">
                Your Success Journey Starts Here
            </h2>
            <p className="text-center text-lg text-gray-600 mb-10">
                Join thousands of students achieving their dreams through education
            </p>
            <div className="flex flex-wrap justify-center gap-8">
                {cards.map((card, idx) => (
                    // 2. div কে Link দিয়ে পরিবর্তন করা হয়েছে, এখন ক্লিক করলে /course এ যাবে
                    <Link
                        to="/course"
                        key={idx}
                        className="w-[340px] h-[235px] bg-white rounded-2xl shadow-lg overflow-hidden relative group transition-all hover:scale-105 cursor-pointer block"
                        style={{ aspectRatio: '16/11' }}
                    >
                        <img
                            src={card.img}
                            alt="card img"
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-400 group-hover:scale-110"
                        />
                        {/* Dark Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/50 transition-colors duration-300" />
                        
                        {/* Quote Text */}
                        <blockquote className="absolute bottom-6 left-0 w-full px-6 z-10 text-white italic text-lg font-medium leading-snug drop-shadow group-hover:bottom-16 transition-all duration-300">
                            &quot;{card.quote}&quot;
                        </blockquote>

                        {/* 3. New Button appearing on Hover */}
                        <div className="absolute bottom-4 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                                Start Learning Now →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
);

export default Card;