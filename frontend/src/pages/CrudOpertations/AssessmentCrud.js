import React, { useEffect, useState } from 'react';
import './AssessmentCrud.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function AssessmentCrud() {
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


    const handleUpdate = (assessment) => {
        navigate(`/update/${assessment._id}`, { state: { assessment } });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/assessments/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setAssessments(assessments.filter(assessment => assessment._id !== id));
                alert('Assessment deleted successfully');
            } else {
                console.error('Failed to delete assessment');
            }
        } catch (error) {
            console.error('Error deleting assessment:', error);
        }
    };



    return (
        <>
            <div className='d-flex container justify-content-end'>
                <button className='btn-Create mt-3' onClick={() => navigate('/create')}>
                    Create Assessment
                </button>
            </div>
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
                        {assessments.map((assessment) => (
                            <tr key={assessment._id}>
                                <td className='w-75 text-start'>{assessment.examName}</td>
                                <td>{assessment.examCategory}</td>
                                <td>
                                    <FontAwesomeIcon
                                        onClick={() => handleUpdate(assessment)}
                                        className='icon'
                                        icon={faPenToSquare}
                                    />

                                    <FontAwesomeIcon
                                        onClick={() => handleDelete(assessment._id)}
                                        className='icon trash'
                                        icon={faTrashCan}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AssessmentCrud;
