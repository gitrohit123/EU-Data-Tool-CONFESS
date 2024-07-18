import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './Result.css';

function ViewExams() {
    const { email } = useParams();
    const [exams, setExams] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://confess-data-tool-backend.vercel.app/api/results/${email}/exams`)
            .then(response => response.json())
            .then(data => setExams(data))
            .catch(error => console.error('Error fetching exams:', error));
    }, [email]);

    const GotoViewAnswer = () => {
        navigate('/answers/${exam.examName}/${exam.examCategory}')
    }

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
                        {exams.map(exam => (
                            <tr key={exam.email}>
                                <td className='text-start'>{exam.examName}</td>
                                <td>{exam.examCategory}</td>
                                <td className='view-exam-icon'>
                                    <Link to={`/answers/${exam.examName}/${exam.examCategory}`} className="view-answer-link">
                                        <FontAwesomeIcon icon={faEye} /> View Answer
                                    </Link>
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
