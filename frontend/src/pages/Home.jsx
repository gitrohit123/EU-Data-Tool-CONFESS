import React, { useState } from 'react';
import LogoLight from "../asset/logo_light.png"
import '../pages/Home.css'

function Home() {

    return (
        <div className='home d-flex justify-content-center' >
            <div className='home-main'>
                <img src={LogoLight} alt='logo' />
                <h1 className='mt-3 fw-normal'>Welcome to the EU Data Tool</h1>
                <div className='text-start mt-5'>
                    <p>Our aim is to support (in particular smaller) companies in their sustainability reporting based on the EU Taxonomy.</p>
                    <p>
                        The EU Taxonomy provides a standardized framework for classifying environmentally sustainable economic activities and is intended to help direct capital flows into such sustainable economic activities.
                    </p>
                    <p>
                        Our tool offers you the opportunity to get an initial overview of the taxonomy conformity of your activities, while at the same time familiarizing you with the requirements of the EU taxonomy. In addition, the tool offers a detailed evaluation of your data and, if desired, a review by our experts or independent third parties.
                    </p>
                    <p>
                        If you are new to taxonomy reporting, we recommend starting with the self-assessment. You can upgrade to the other options at any time.
                    </p>
                </div>
                <div className='mt-5 d-flex justify-content-center gap-5'>
                    <div className="card">
                        <div className="card-body d-flex flex-column justify-content-between align-items-center">
                            <h5 className="card-title fs-5 text-start ">Self-Assessment</h5>
                            <p className="card-text mt-4 text-start ">Use the self-assessment to familiarize yourself with the requirements of the EU taxonomy for your economic activities and to get an initial overview of the potential taxonomy alignment of your activities.</p>
                            <a href="/login" className="btn-1">Choose Option</a>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body d-flex flex-column justify-content-between align-items-center">
                            <h5 className="card-title fs-5   text-start ">Expert Check</h5>
                            <p className="card-text mt-4 text-start ">Our experts check your statements in the self-assessment and verify the taxonomy alignment of your activities based on additional documents you upload as proof of your statements.</p>
                            <a href="#" className="btn-5">Choose Option</a>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body d-flex flex-column justify-content-between align-items-center">
                            <h5 className="card-title fs-5 text-start">3rd Party Verification</h5>
                            <p className="card-text mt-4 text-start ">An independent third party checks your statements in the self-assessment and verifies the taxonomy alignment of your activities based on additional documents you upload as proof of your statements.</p>
                            <a href="#" className="btn-5">Choose Option</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home