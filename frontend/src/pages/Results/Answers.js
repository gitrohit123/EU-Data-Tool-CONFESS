import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Result.css';

function Answers() {
    const { examName, examCategory } = useParams();
    const [questionAnswers, setQuestionAnswers] = useState([]);

    useEffect(() => {
        fetch(`https://confess-data-tool-backend.vercel.app/api/results/${examName}/${examCategory}/answers`)
            .then(response => response.json())
            .then(data => setQuestionAnswers(data))
            .catch(error => console.error('Error fetching answers:', error));
    }, [examName, examCategory]);
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
