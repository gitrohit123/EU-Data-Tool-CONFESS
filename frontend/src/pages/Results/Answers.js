import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Result.css';

function Answers() {
    const { examName, examCategory } = useParams(); // _id is now a query parameter
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email'); // Get email from query params
    const _id = new URLSearchParams(location.search).get('_id');

    console.log(examCategory);

    useEffect(() => {
        if (_id) {
            fetch(`https://-beta.vercel.app/api/results/${examName}/${examCategory}/answers?_id=${_id}`)
                .then(response => response.json())
                .then(data => setQuestionAnswers(data))
                .catch(error => console.error('Error fetching answers:', error));
        } else {
            console.error('No _id provided');
        }
    }, [examName, examCategory, _id]);

    console.log(questionAnswers);

    return (
        <div>
            <div className='mt-5 Crud-main-container container'>
                <table className="table Crud-main container">
                    <thead>
                        <tr className="Crud-thead-wrapper">
                            <th scope="col" className='text-start'>Question</th>
                            <th scope="col">Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionAnswers.map((qa, index) => (
                            <tr key={index}>
                                <td className='text-start'>{qa.question}</td>
                                <td>{qa.answer}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Answers;
