import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import Footer from '../Pages/Shared/Footer/Footer';
import StartLearningBanner from '../Pages/Shared/StartLearningBanner';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <StartLearningBanner></StartLearningBanner>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;