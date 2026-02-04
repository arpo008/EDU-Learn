import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import CourseMaterial from "../Pages/Home/CourseMaterial/CourseMaterial";
import AiLearningAssistant from "../Pages/AiLearningAssistant/AiLearningAssistant";
import Videos from "../Pages/Videos/Videos";
import AboutSection from "../Pages/AboutSection/AboutSection";
import ContactFaqSection from "../Pages/Contact/ContactFaqSection";
import CourseDetails from "../Pages/CourseDetails/CourseDetails";
import TutorChat from "../Pages/Tutor/TutorChat"; 

// ✅ Auth Pages Import
import Login from "../Pages/Login/Login";    
import SignUp from "../Pages/SignUp/SignUp"; 

// ✅ Exam Pages Import
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
        {
            path: "tutor-ai",
            Component: TutorChat
        },
        {
            path: "about",
            Component: AboutSection
        },
        // ✅ ফিক্সড: Login রাউটে কম্পোনেন্ট বসানো হয়েছে
        {
            path: "login",
            Component: Login
        },
        // ✅ ফিক্সড: SignUp রাউটে কম্পোনেন্ট বসানো হয়েছে
        {
            path: "signup",
            Component: SignUp
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
            path: "exam/:classId", // ডায়নামিক রাউট
            Component: ExamPage
        }
    ]
  },
]);