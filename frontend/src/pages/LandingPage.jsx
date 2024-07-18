import React, { useEffect, useState } from 'react';
import '../pages/LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const [assessments, setAssessments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await fetch('https://confess-data-tool-backend.vercel.app/api/assessments');
                if (response.ok) {
                    const data = await response.json();
                    setAssessments(data);
                } else {
                    console.error('Failed to fetch assessments');
                }
            } catch (error) {
                console.error('Error fetching assessments:', error);
            }
        };

        fetchAssessments();
    }, []);

    const startButton = (examName, examCategory) => {
        navigate('/instructions', { state: { examName, examCategory } });
    };

    return (
        <div className='mt-5 d-flex justify-content-center align-items-center landing-page'>
            <section className='landing-main'>
                <h2>Selection of Activities</h2>
                <h5 className='activity-text'>
                    <FontAwesomeIcon icon={faInfoCircle} /> From this list of activity types, please select the activity type to which the activity you like to check for taxonomy alignment matches. Once you have finished performing an activity assessment, you will be taken back to this page so that you can subsequently complete other activities of the same or a different type. The evaluation of the taxonomy alignment of your activities can be found in the Dashboard section. As soon as you complete the assessment for a new activity, the dashboard is automatically updated.
                </h5>

                <div className='cards-main'>
                    {assessments.map((assessment) => (
                        <div className="card" key={assessment._id}>
                            <div className='card-body'>
                                <h5 className="card-text">{assessment.examName}</h5>
                                <div className="card-title h5">Category: {assessment.examCategory}</div>
                                <button onClick={() => startButton(assessment.examName, assessment.examCategory)} type="button" className="btn-2">Start Evaluation</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
