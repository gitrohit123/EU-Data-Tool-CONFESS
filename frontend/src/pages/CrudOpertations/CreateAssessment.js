import React, { useState } from 'react';
import './CreateAssessment.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { useNavigate } from 'react-router-dom';

function CreateAssessment() {
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [language, setLanguage] = useState(''); // Add state for language

    const clearInput1 = () => setName1('');
    const clearInput2 = () => setName2('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const assessmentData = {
            examName: name1,
            examCategory: name2,
            language: language // Include language in assessmentData
        };

        try {
            const response = await fetch('https://confess-data-tool-backend.vercel.app/api/assessments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assessmentData)
            });

            if (response.ok) {
                alert('Assessment saved successfully!');
                navigate('/assessment');
            } else {
                const errorData = await response.text();
                alert(`Failed to save assessment: ${errorData}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the assessment.');
        }
    };

    return (
        <div className='container'>
            <h2 className='text-start mt-5'>Create Exam</h2>
            <hr />

            <section className='create-buttons'>
                <button className='active'>Exam Details</button>
                <button className='disabled-button'>Questions</button>
            </section>

            <section className='form-create'>
                <form onSubmit={handleSubmit}>

                    <div className={`input-wrap ${name1 ? 'has-value' : ''}`}>
                        <input
                            type='text'
                            className='input1'
                            value={name1}
                            onChange={(e) => setName1(e.target.value)}
                        />
                        <label>Exam Name</label>
                        {name1 && <button type="button" className="clear-button" onClick={clearInput1}>
                            <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                        </button>}
                    </div>

                    <div className={`input-wrap ${name2 ? 'has-value' : ''}`}>
                        <input
                            type='text'
                            className='input2'
                            value={name2}
                            onChange={(e) => setName2(e.target.value)}
                        />
                        <label>Exam Category</label>
                        {name2 && <button type="button" className="clear-button" onClick={clearInput2}>
                            <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                        </button>}
                    </div>

                    <div className={`input-wrap ${language ? 'has-value' : ''}`}>
                        <select className='input3' value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option className='d-none text-secondary' value=""></option>
                            <option value="english">English</option>
                            <option value="german">German</option>
                        </select>
                        <label className='text-secondary'>Language <span className='text-danger'>*</span></label>
                    </div>

                    <div className='d-flex justify-content-between mt-3'>
                        <button type='button' onClick={() => navigate('/assessment')} className='btn-cancel'>Cancel</button>
                        <button type='submit' className='btn-Create'>Save</button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default CreateAssessment;
