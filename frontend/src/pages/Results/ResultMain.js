import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Result.css';

function ResultMain() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://confess-data-tool-backend.vercel.app/api/results')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleViewExams = (email) => {
        navigate(`/view-exams/${email}`);
    };


    console.log(users);
    return (
        <div>
            <div className='mt-5 Crud-main-container container'>
                <table className="table Crud-main container">
                    <thead>
                        <tr className="Crud-thead-wrapper">
                            <th scope="col" className='text-start'>Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.email}>
                                <td className='text-start'>{user.name}</td>
                                <td>{user.email}</td>
                                <td className='view-exam-icon' onClick={() => handleViewExams(user.email)}>
                                    <FontAwesomeIcon icon={faEye} /> View Exams
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ResultMain;
