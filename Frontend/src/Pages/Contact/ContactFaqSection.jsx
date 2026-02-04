import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react"; // Replace with your own icons or SVGs as needed

const contactCards = [
    {
        icon: <Mail className="w-7 h-7 text-blue-500" />,
        title: "Email",
        content: (
            <>
                info@edulearn.com
                <br />
                support@edulearn.com
            </>
        ),
        style: "bg-gradient-to-br from-blue-50 to-white",
    },
    {
        icon: <Phone className="w-7 h-7 text-purple-500" />,
        title: "Phone",
        content: (
            <>
                +1 (555) 123-4567
                <br />
                Mon–Fri 9am–6pm EST
            </>
        ),
        style: "bg-gradient-to-br from-purple-50 to-white",
    },
    {
        icon: <MapPin className="w-7 h-7 text-orange-500" />,
        title: "Address",
        content: (
            <>
                123 Education Street
                <br />
                New York, NY 10001
            </>
        ),
        style: "bg-gradient-to-br from-orange-50 to-white",
    },
    {
        icon: <Clock className="w-7 h-7 text-green-500" />,
        title: "Support Hours",
        content: (
            <>
                Monday–Friday
                <br />
                9:00 AM–6:00 PM EST
            </>
        ),
        style: "bg-gradient-to-br from-green-50 to-white",
    }
];

const faqs = [
    {
        q: "How do I enroll in a course?",
        a: "Simply browse our course catalog, select the course you're interested in, and click the “Enroll Now” button. You can start learning immediately after enrollment."
    },
    {
        q: "Is the AI Q&A assistant available 24/7?",
        a: "Yes! Our AI learning assistant is available around the clock to help answer your questions and provide learning support whenever you need it."
    },
    {
        q: "Do you offer certificates?",
        a: "Yes, upon successful completion of a course, you'll receive a certificate that you can share on your resume and LinkedIn profile."
    },
    {
        q: "What is your refund policy?",
        a: "We offer a 30-day money-back guarantee. If you're not satisfied with your course within the first 30 days, we'll provide a full refund, no questions asked."
    }
];

const cardVariants = {
    hidden: { opacity: 0, y: 44 },
    visible: i => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.13, duration: 0.6, type: 'spring', stiffness: 140 }
    })
};

export default function ContactFaqSection() {
    return (
        <section className="w-full bg-gradient-to-b from-[#f6f7fb] to-white py-14 px-3">



            {/* Contact */}
            <div className="max-w-5xl mx-auto mb-12">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-center mb-2 text-indigo-700"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}>
                    Get in Touch
                </motion.h2>
                <motion.p
                    className="text-center text-gray-500 mb-9"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.08 }}>
                    Have questions? We'd love to hear from you. Send us a message and we'll<br />respond as soon as possible.
                </motion.p>
                <div className="flex flex-col md:flex-row gap-10 items-start justify-center">
                    {/* Contact Form */}
                    <motion.form
                        className="flex-1 bg-white rounded-2xl shadow-2xl p-7 border border-white/60 max-w-xl min-w-[320px]"
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        onSubmit={e => { e.preventDefault(); alert('Message sent! (demo)'); }}
                    >
                        <div className="mb-4 font-semibold text-blue-700 flex gap-2 items-center">
                            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24"><path d="M12 2v20m10-10H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            Send us a Message
                        </div>
                        <div className="flex gap-4 mb-4">
                            <input required placeholder="First Name" className="flex-1 p-3 border border-blue-100 text-black rounded-lg bg-blue-50 focus:bg-white focus:border-blue-400 transition" />
                            <input required placeholder="Last Name" className="flex-1 p-3 border border-blue-100 text-black rounded-lg bg-blue-50 focus:bg-white focus:border-blue-400 transition" />
                        </div>
                        <input required type="email" placeholder="Email" className="w-full p-3 border border-blue-100 text-black rounded-lg bg-blue-50 focus:bg-white focus:border-blue-400 transition mb-4" />
                        <input required placeholder="Subject" className="w-full p-3 border border-blue-100 rounded-lg text-black bg-blue-50 focus:bg-white focus:border-blue-400 transition mb-4" />
                        <textarea required placeholder="Message" className="w-full p-3 border border-blue-100 text-black rounded-lg bg-blue-50 focus:bg-white focus:border-blue-400 transition mb-4 min-h-[90px]" />
                        <motion.button
                            whileHover={{
                                scale: 1.04,
                                background: "linear-gradient(90deg,#6366f1,#60a5fa 80%,#818cf8)",
                                boxShadow: "0 2px 14px 0 #6366f1,0 0 0 0 #fff"
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-indigo-500 to-sky-400 shadow-md transition"
                            type="submit"
                        >Send Message <span className="ml-2">✈️</span></motion.button>
                    </motion.form>
                    {/* Contact Info Cards */}
                    <div className="flex flex-col gap-4 w-full md:max-w-xs">
                        {contactCards.map((card, i) => (
                            <motion.div key={card.title}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: 0.16 + 0.11 * i }}
                                className={`rounded-2xl shadow-lg p-5 border border-white/60 flex gap-4 items-start ${card.style}`}>
                                <div>{card.icon}</div>
                                <div>
                                    <div className="font-semibold text-primary text-[17px] mb-1">{card.title}</div>
                                    <div className="text-gray-600 text-sm">{card.content}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ */}

            <div className="max-w-2xl mx-auto mb-16">
                <motion.h2
                    className="text-3xl md:text-4xl text-black font-bold text-center mb-3"
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}>
                    Frequently Asked Questions
                </motion.h2>
                <motion.p
                    className="text-center text-gray-500 mb-7"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.1 }}>
                    Quick answers to common questions
                </motion.p>
                <div className="flex flex-col gap-5">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={faq.q}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="bg-white shadow-lg rounded-xl px-6 py-5 border-l-4 border-blue-400/80 hover:border-green-500 hover:translate-2.5 transition"
                        >
                            <div className="font-medium text-blue-600 mb-0.5 text-base">{faq.q}</div>
                            <div className="text-gray-700 text-[15px] leading-relaxed">{faq.a}</div>
                        </motion.div>
                    ))}
                </div>
            </div>




        </section>
    );
}
