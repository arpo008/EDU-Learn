import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import CourseMaterial from "../Pages/Home/CourseMaterial/CourseMaterial";
import AiLearningAssistant from "../Pages/AiLearningAssistant/AiLearningAssistant";
import Videos from "../Pages/Videos/Videos";
import AboutSection from "../Pages/AboutSection/AboutSection";
import ContactFaqSection from "../Pages/Contact/ContactFaqSection";
import CourseDetails from "../Pages/CourseDetails/CourseDetails";
// 👇 এই নতুন ইমপোর্টটি মিসিং ছিল
import TutorChat from "../Pages/Tutor/TutorChat"; 
import ExamDashboard from "../Pages/Exam/ExamDashboard";
import ExamPage from "../Pages/Exam/ExamPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        {
            path: "course",
            Component: CourseMaterial
        },
        {
            path: "course-details/:classID",
            Component: CourseDetails
        },
        {
            path: "ai",
            Component: AiLearningAssistant
        },
        {
            path: "video",
            Component: Videos
        },
        // 👇 এখানে TutorChat ব্যবহার করা হয়েছে, তাই উপরে ইমপোর্ট থাকতে হবে
        {
            path: "tutor-ai",
            Component: TutorChat
        },
        {
            path: "about",
            Component: AboutSection
        },
        {
            path: "contact",
            Component: ContactFaqSection
        },
        {
            path: "exam-dashboard",
            Component: ExamDashboard
        },
        {
            path: "exam/:classId", // ডায়নামিক রাউট (যেমন: /exam/class_6)
            Component: ExamPage
        }
    ]
  },
]);