import { motion } from "framer-motion";

// Replace with your actual imported assets for real projects
const aboutImages = [
    { src: "/images/rut-miit-mPaKMvE3sHg-unsplash.jpg", alt: "Graduation students" },
    { src: "/images/Mission.png", alt: "Mission" },
    { src: "/images/Vision.png", alt: "Vision" },
    { src: "/images/idea.png", alt: "Values" },
    { src: "/images/partners.png", alt: "Team" }
];

const fadeLeft = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } };
const fadeUp = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } };
const imgHover = {
    rest: { scale: 1, boxShadow: "0 8px 32px 0 rgba(59,130,246,0.09)" },
    hover: {
        scale: 1.045, rotate: 2, y: -8,
        boxShadow: "0 18px 40px 0 rgba(70, 90, 200, .18)",
        transition: { type: "spring", stiffness: 250, damping: 13 }
    }
};

export default function AboutSectionMotion() {
    const teamMembers = [
        { name: "Dr. Sarah Johnson", role: "Chief Education Officer", img: aboutImages[0].src },
        { name: "Michael Chen", role: "Head of Technology", img: aboutImages[1].src },
        { name: "Emily Rodriguez", role: "Director of Content", img: aboutImages[2].src },
        { name: "David Kumar", role: "Student Success Manager", img: aboutImages[3].src },
    ];

    return (
        <section className="w-full">

            {/* About gradient header (fade in up) */}
            <motion.div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-center py-14 my-4 rounded-b-3xl shadow"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
            >
                <h1 className="text-5xl font-bold text-white mb-3">About EduLearn</h1>
                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                    We're on a mission to make quality education accessible to everyone, everywhere, powered by cutting-edge AI technology.
                </p>
            </motion.div>

            {/* Story section */}
            <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto py-16 px-3">
                {/* Text - slides in from left */}
                <motion.div
                    variants={fadeLeft}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.8, delay: 0.13 }}
                    viewport={{ once: true, amount: 0.6 }}
                >
                    <h2 className="text-3xl font-semibold mb-4 text-blue-700">Our Story</h2>
                    <p className="text-gray-600 mb-3">
                        Founded in 2020, EduLearn began with a simple idea: everyone deserves access to quality education, regardless of their location or background.
                    </p>
                    <p className="text-gray-600 mb-3">
                        We started with just 10 courses and 100 students. Today, we serve over 50,000 active learners worldwide, offering 500+ courses across multiple disciplines.
                    </p>
                    <p className="text-gray-600">
                        Our AI-powered learning assistant represents our commitment to innovation in education, providing students with instant, personalized support 24/7.
                    </p>
                </motion.div>
                {/* Image - slides in from right, motion/hover */}
                <motion.div
                    className="rounded-3xl shadow-2xl overflow-hidden bg-white aspect-video"
                    variants={fadeRight}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.8, delay: 0.15 }}
                    viewport={{ once: true, amount: 0.6 }}
                >
                    <motion.img
                        src={aboutImages[0].src} alt={aboutImages[0].alt}
                        className="object-cover w-full h-full transition-all duration-400"
                        variants={imgHover}
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                    />
                </motion.div>
            </div>

            {/* Mission & Vision (slide in, left/right) */}
            <div className="bg-gradient-to-br from-blue-50 to-white py-16 relative">
                <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
                    {/* Mission(left) */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl p-8 flex items-center gap-5"
                        variants={fadeLeft}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.8, delay: 0.16 }}
                        viewport={{ once: true, amount: 0.65 }}
                    >
                        <motion.img src={aboutImages[1].src} alt="Mission icon"
                            className="w-20 h-20 rounded-lg object-cover shadow"
                            variants={imgHover}
                            initial="rest"
                            whileHover="hover"
                            animate="rest"
                        />
                        <div>
                            <h3 className="text-2xl text-primary font-semibold mb-2">Our Mission</h3>
                            <p className="text-gray-600 text-base">
                                To empower individuals worldwide with accessible, high-quality education that transforms lives and opens doors to new opportunities.
                            </p>
                        </div>
                    </motion.div>

                    {/* Vision(right) */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl p-8 flex items-center gap-5"
                        variants={fadeRight}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true, amount: 0.65 }}
                    >
                        <motion.img src={aboutImages[2].src} alt="Vision icon"
                            className="w-20 h-20 rounded-lg object-cover shadow"
                            variants={imgHover}
                            initial="rest"
                            whileHover="hover"
                            animate="rest"
                        />
                        <div>
                            <h3 className="text-2xl text-primary font-semibold mb-2">Our Vision</h3>
                            <p className="text-gray-600 text-base">
                                To become the world's leading AI-powered learning platform, where anyone can master any skill and achieve their full potential.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Values - cards animate one by one up */}
            <div className="py-16">
                <h2 className="text-center text-primary text-3xl font-bold mb-3">Our Values</h2>
                <p className="text-center text-gray-500 mb-12">
                    The principles that guide everything we do
                </p>
                <div className="max-w-5xl  mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Excellence', description: 'We strive for excellence in everything we do, from course content to student support.', img: aboutImages[1].src, d: 0.18 },
                        { label: 'Passion', description: 'We are passionate about education and believe in the transformative power of learning.', img: aboutImages[2].src, d: 0.22 },
                        { label: 'Community', description: 'We foster a supportive learning community where students help each other grow.', img: aboutImages[3].src, d: 0.26 },
                        { label: 'Innovation', description: 'We embrace new technologies like AI to enhance the learning experience.', img: aboutImages[4].src, d: 0.3 },
                    ].map((val, i) => (
                        <motion.div
                            key={val.label}
                            className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            transition={{ duration: 0.7, delay: val.d }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <motion.img src={val.img} alt={val.label}
                                className="w-16 h-16 object-cover rounded-xl shadow mb-3"
                                variants={imgHover}
                                initial="rest"
                                whileHover="hover"
                                animate="rest"
                            />
                            <h4 className="text-xl text-secondary font-semibold mb-2">{val.label}</h4>
                            <p className="text-gray-500 text-center">{val.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Team - cards animate up staggered */}
            <div className="py-16 bg-gradient-to-b from-blue-50 to-white">
                <h2 className="text-center text-3xl text-primary font-bold mb-2">Meet Our Team</h2>
                <p className="text-center text-gray-500 mb-10">
                    Passionate educators and innovators dedicated to your success
                </p>
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">
                    {teamMembers.map((member, idx) => (
                        <motion.div
                            key={member.name}
                            className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition group p-0 flex flex-col"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            transition={{ duration: 0.7, delay: 0.19 + idx * 0.1 }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <motion.img src={member.img} alt={member.name}
                                className="h-48 object-cover w-full group-hover:scale-105 transition duration-300"
                                variants={imgHover}
                                initial="rest"
                                whileHover="hover"
                                animate="rest"
                            />
                            <div className="p-5 flex flex-col gap-1 flex-1 items-center">
                                <h5 className="font-bold text-gray-800 text-lg">{member.name}</h5>
                                <span className="text-gray-500 text-sm">{member.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
