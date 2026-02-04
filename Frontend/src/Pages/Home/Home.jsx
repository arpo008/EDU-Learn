import React from 'react';
import Banner from './Banner/Banner';
import Card from './Card/Card';
import EduLearnFeatures from './EduLearnFeatures/EduLearnFeatures';
import HowItWorks from './HowItWorks/HowItsWorks';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Card></Card>
            <EduLearnFeatures></EduLearnFeatures>
            <HowItWorks></HowItWorks>
        </div>
    );
};

export default Home;