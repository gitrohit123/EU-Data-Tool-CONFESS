import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './Result.css';

function ViewExams() {
    const { email } = useParams();
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://confess-data-tool-backend-beta.vercel.app/api/results/${email}/exams`)
            .then(response => response.json())
            .then(data => setExams(data))
            .catch(error => console.error('Error fetching exams:', error));
    }, [email]);
    console.log(exams);

    const GotoViewAnswer = (_id, examName, examCategory) => {
        navigate(`/answers/${examName}/${examCategory}?_id=${_id}`);
    };

    return (
        <div>
            <div className='mt-5 Crud-main-container container'>
                <table className="table Crud-main container">
                    <thead>
                        <tr className="Crud-thead-wrapper">
                            <th scope="col" className='text-start'>Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam, index) => (
                            <tr key={index}>
                                <td className='text-start'>{exam.examName}</td>
                                <td>{exam.examCategory}</td>
                                <td className='view-exam-icon' onClick={() => GotoViewAnswer(exam._id, exam.examName, exam.examCategory)}>
                                    <FontAwesomeIcon icon={faEye} /> View Answer
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewExams;
