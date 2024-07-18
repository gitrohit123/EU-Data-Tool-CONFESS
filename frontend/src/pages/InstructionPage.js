import React from 'react';
import './InstructionPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

function InstructionPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { examName } = state || {};
    const { examCategory } = state || {};

    const startAssessment = () => {
        navigate('/take-assessment', { state: { examName, examCategory } }); // Update the route here
    };

    return (
        <div className='instruction-main container'>
            <h1>Welcome to the Exam</h1>
            <h2>{examName}</h2>
            <h2>{examCategory}</h2>
            <h3 className='instruction'>Instructions for the assessment</h3>
            <ul>
                <li>Do not refresh the page.</li>
                <li>You can use the <strong>"Previous"</strong> and <strong>"Next"</strong> buttons to navigate between questions.</li>
                <li>While doing the assessment you can go back and forth to the different questions at any time</li>
                <li>Evaluation dashboard will be created after you actively finish the assessment by clicking the respective button</li>
            </ul>

            <section>
                <button className='btn-cancel' onClick={() => navigate('/landing')}>Cancel</button>
                <button className='btn-Start' onClick={startAssessment}>Start Assessment</button>
            </section>
        </div>
    );
}

export default InstructionPage;
