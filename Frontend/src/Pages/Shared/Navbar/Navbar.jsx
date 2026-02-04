import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Navbar = () => {
    
    // মেনু আইটেমগুলো
    const navItems = <>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/course'>Courses</NavLink></li>
        
        {/* ক্লাস অনুযায়ী লিংক (অপশনাল, যদি ড্রপডাউন চান) */}
        {/* <li><NavLink to='/course-details/class6'>Class 6</NavLink></li> */}

        <li><NavLink to='/ai'>AI Q&A</NavLink></li>
        <li><NavLink to='/video'>Video</NavLink></li>
        <li><NavLink to='/tutor-ai' className="font-bold text-blue-600">Talk to Tutor 💬</NavLink></li>
        <li><NavLink to='/exam-dashboard' className="font-medium text-purple-600">Exam Portal ✍️</NavLink></li>
        <li><NavLink to='/about'>About</NavLink></li>
        <li><NavLink to='/contact'>Contact</NavLink></li>
    </>;

    return (
        <div className="navbar bg-white shadow-2xl sticky top-0 z-50"> {/* sticky added for better UX */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
                        </svg>
                    </div>
                    <ul tabIndex="-1" className="menu menu-sm dropdown-content text-black bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {navItems}
                    </ul>
                </div>
                
                {/* Logo Section */}
                <Link to="/" className='h-14 items-center flex justify-center gap-2 px-2'>
                     <BookOpen className="w-8 h-8 text-blue-600" />
                     <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-700 via-green-600 to-purple-500 bg-clip-text text-transparent'>
                        EduLearn
                     </h1>
                </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu text-black menu-horizontal px-1 gap-2">
                    {navItems}
                </ul>
            </div>
            
            <div className="navbar-end">
                <Link to="/login" className="btn bg-blue-600 text-white hover:bg-blue-700 border-none px-6">Login</Link>
            </div>
        </div>
    );
};

export default Navbar;