import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateAssessment.css';

function UpdateAssessment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [questionPop, setQuestionPop] = useState(false);
    const [exam, setExam] = useState(true);
    const [question, setQuestion] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null); // State for editing question

    useEffect(() => {
        const fetchAssessment = async () => {
            console.log(`Fetching assessment with ID: ${id}`);
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/assessments/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAssessment(data);
                } else {
                    console.error('Failed to fetch assessment');
                }
            } catch (error) {
                console.error('Error fetching assessment:', error);
            }
        };

        fetchAssessment();
    }, [id]);

    const showExam = () => {
        setExam(true);
        setQuestion(false);
    };

    const showQuestions = () => {
        setQuestion(true);
        setExam(false);
    };

    const addQuestion = (newQuestion) => {
        setAssessment({
            ...assessment,
            questions: [...assessment.questions, newQuestion]
        });
        setQuestionPop(false);
    };

    const updateQuestion = (updatedQuestion) => {
        setAssessment({
            ...assessment,
            questions: assessment.questions.map(q => q._id === updatedQuestion._id ? updatedQuestion : q)
        });
        setQuestionPop(false);
        setEditingQuestion(null);
    };

    if (!assessment) {
        return <div>Loading...</div>;
    }

    const handleAddQuestion = () => {
        setQuestionPop(true);
        setEditingQuestion(null); // Clear editing state
    };

    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
        setQuestionPop(true);
    };

    const deleteQuestion = async (questionId) => {
        try {
            const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/assessments/${assessment._id}/questions/${questionId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAssessment({
                    ...assessment,
                    questions: assessment.questions.filter(q => q._id !== questionId)
                });
            } else {
                console.error('Failed to delete question');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <>
            <div className='container'>
                <h2 className='text-start mt-5'>Edit Exam</h2>
                <hr />

                <section className='Edit-buttons'>
                    <div className={`slider ${exam ? 'left' : 'right'}`}></div>
                    <button className={exam ? 'active' : ''} onClick={showExam}>Exam Details</button>
                    <button className={question ? 'active' : ''} onClick={showQuestions}>Questions</button>
                </section>

                {exam && <EditDetails examName={assessment.examName} examCategory={assessment.examCategory} assessmentId={assessment._id} />}
                {question &&
                    <>
                        <div className='d-flex container justify-content-end'>
                            <button className='btn-Create mt-3' onClick={handleAddQuestion}>Add Question</button>
                        </div>
                        <div className='mt-5 Crud-main-container container'>
                            <table className="table Crud-main container">
                                <thead>
                                    <tr className="Crud-thead-wrapper">
                                        <th scope="col">Question ID</th>
                                        <th scope="col">Question</th>
                                        <th scope="col">Question Type</th>
                                        <th scope="col">Next Questions</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assessment.questions.map((question, index) => (
                                        <tr key={index}>
                                            <td>{question.questionID}</td>
                                            <td>{question.question}</td>
                                            <td>{question.questionType}</td>
                                            <td>{question.nextQuestions}</td>
                                            <td>
                                                <FontAwesomeIcon className='icon' icon={faPenToSquare} onClick={() => handleEditQuestion(question)} />
                                                <FontAwesomeIcon
                                                    className='icon trash'
                                                    icon={faTrashCan}
                                                    onClick={() => deleteQuestion(question._id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            </div>
            {questionPop && <AddQuestion setQuestionPop={setQuestionPop} addQuestion={addQuestion} updateQuestion={updateQuestion} editingQuestion={editingQuestion} />}
        </>
    );
}

export default UpdateAssessment;

const EditDetails = ({ examName, examCategory, assessmentId }) => {
    const [name1, setName1] = useState(examName);
    const [name2, setName2] = useState(examCategory);
    const navigate = useNavigate();

    const clearInput1 = () => setName1('');
    const clearInput2 = () => setName2('');

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://confess-data-tool-backend.vercel.app/${assessmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ examName: name1, examCategory: name2 }),
            });

            if (response.ok) {
                alert('Assessment updated successfully');
                navigate('/assessment');
            } else {
                console.error('Failed to update assessment');
            }
        } catch (error) {
            console.error('Error updating assessment:', error);
        }
    };

    return (
        <>
            <div className='container'>
                <section className='form-create'>
                    <form onSubmit={handleSave}>
                        <div className={`input-wrap ${name1 ? 'has-value' : ''}`}>
                            <input
                                type='text'
                                className='input1'
                                value={name1}
                                onChange={(e) => setName1(e.target.value)}
                            />
                            <label>Exam Name</label>
                            {name1 && (
                                <button type="button" className="clear-button" onClick={clearInput1}>
                                    <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                                </button>
                            )}
                        </div>

                        <div className={`input-wrap ${name2 ? 'has-value' : ''}`}>
                            <input
                                type='text'
                                className='input2'
                                value={name2}
                                onChange={(e) => setName2(e.target.value)}
                            />
                            <label>Exam Category</label>
                            {name2 && (
                                <button type="button" className="clear-button" onClick={clearInput2}>
                                    <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                                </button>
                            )}
                        </div>

                        <div className='d-flex justify-content-between mt-3'>
                            <button type="button" onClick={() => navigate('/assessment')} className='btn-cancel'>Cancel</button>
                            <button type="submit" className='btn-Create'>Save</button>
                        </div>
                    </form>
                </section>
            </div>

        </>
    );
};

const AddQuestion = ({ setQuestionPop, addQuestion, updateQuestion, editingQuestion }) => {
    const { id } = useParams();
    const [name1, setName1] = useState(editingQuestion ? editingQuestion.questionID : '');
    const [name2, setName2] = useState(editingQuestion ? editingQuestion.question : '');
    const [name5, setName5] = useState(editingQuestion ? editingQuestion.nextQuestions : '');
    const [name6, setName6] = useState(editingQuestion ? editingQuestion.disclaimer : '');
    const [name7, setName7] = useState(editingQuestion ? editingQuestion.alertText : '');
    const [options, setOptions] = useState(editingQuestion ? editingQuestion.options || [] : []);
    const [questionType, setQuestionType] = useState(editingQuestion ? editingQuestion.questionType : '');
    const [questionCategory, setQuestionCategory] = useState(editingQuestion ? editingQuestion.questionCategory : '');
    const [examDetails, setExamDetails] = useState({});

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/assessments/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setExamDetails({ examName: data.examName, examCategory: data.examCategory });
                } else {
                    console.error('Failed to fetch exam details');
                }
            } catch (error) {
                console.error('Error fetching exam details:', error);
            }
        };

        fetchExamDetails();
    }, [id]);

    const clearInput = (setFunction) => () => setFunction('');

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async () => {
        const newQuestion = {
            questionID: name1,
            question: name2,
            questionType,
            questionCategory,
            nextQuestions: name5,
            disclaimer: name6,
            alertText: name7,
            options: questionType === "MCQ" || questionType === "Multiple Select" ? options : [],
            examName: examDetails.examName,
            examCategory: examDetails.examCategory
        };

        try {
            const response = editingQuestion ?
                await fetch(`https://confess-data-tool-backend.vercel.app/api/assessments/${id}/questions/${editingQuestion._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newQuestion),
                })
                :
                await fetch(`https://confess-data-tool-backend.vercel.app/api/assessments/${id}/questions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newQuestion),
                });

            if (response.ok) {
                editingQuestion ? updateQuestion({ ...newQuestion, _id: editingQuestion._id }) : addQuestion(newQuestion);
                setQuestionPop(false);
            } else {
                console.error('Failed to save question');
            }
        } catch (error) {
            console.error('Error saving question:', error);
        }
    };


    const canAddOption = (questionType === "MCQ" && options.length < 4) || (questionType === "Multiple Select" && options.length < 5);

    return (
        <section className='add-question-main'>
            <section className='form-input'>
                <form>
                    <h4>{editingQuestion ? 'Edit Question' : 'Add Question'}</h4>
                    <div className={`input-wraps ${name1 ? 'has-values' : ''}`}>
                        <input type='text' className='input-1' value={name1} onChange={(e) => setName1(e.target.value)} />
                        <label>Question ID <span className='text-danger'>*</span></label>
                        {name1 && <button type="button" className="clear-buttons" onClick={clearInput(setName1)}>
                            <FontAwesomeIcon className='input-close-icons' icon={faCircleXmark} />
                        </button>}
                    </div>

                    <div className={`input-wraps ${name2 ? 'has-values' : ''}`}>
                        <textarea className='input-2' value={name2} onChange={(e) => setName2(e.target.value)}></textarea>
                        <label>Question <span className='text-danger'>*</span></label>
                        {name2 && <button type="button" className="clear-buttons" onClick={clearInput(setName2)}>
                            <FontAwesomeIcon className='input-close-icons' icon={faCircleXmark} />
                        </button>}
                    </div>

                    <div className={`input-wraps ${questionType ? 'has-values' : ''}`}>
                        <select className='input-3' value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                            <option className='d-none' value=""></option>
                            <option value="MCQ">MCQ</option>
                            <option value="Short">Short</option>
                            <option value="Long Text">Long Text</option>
                            <option value="Numerical Value">Numerical Value</option>
                            <option value="Multiple Select">Multiple Select</option>
                            <option value="Blank">Blank</option>
                        </select>
                        <label>Question Type <span className='text-danger'>*</span></label>
                    </div>

                    <div className={`input-wraps ${questionCategory ? 'has-values' : ''}`}>
                        <select className='input-3' value={questionCategory} onChange={(e) => setQuestionCategory(e.target.value)}>
                            <option className='d-none' value=""></option>
                            <option value="Substantial Contribution">Substantial Contribution</option>
                            <option value="DNSH - Adaptation">DNSH - Adaptation</option>
                            <option value="DNSH - Biodiversity">DNSH - Biodiversity</option>
                            <option value="DNSH - Water">DNSH - Water</option>
                            <option value="DNSH - CE">DNSH - CE</option>
                            <option value="DNSH - Pollution">DNSH - Pollution</option>
                            <option value="Turnover">Turnover</option>
                            <option value="CapEx">CapEx</option>
                            <option value="OpEx">OpEx</option>
                            <option value="Blank">Blank</option>
                        </select>
                        <label>Question Category <span className='text-danger'>*</span></label>
                    </div>

                    <div className={`input-wraps ${name5 ? 'has-values' : ''}`}>
                        <input type='text' className='input-5' value={name5} onChange={(e) => setName5(e.target.value)} />
                        <label>Next Question</label>
                        {name5 && <button type="button" className="clear-buttons" onClick={clearInput(setName5)}>
                            <FontAwesomeIcon className='input-close-icons' icon={faCircleXmark} />
                        </button>}
                    </div>

                    <div className={`input-wraps ${name6 ? 'has-values' : ''}`}>
                        <input type='text' className='input-5' value={name6} onChange={(e) => setName6(e.target.value)} />
                        <label>Add Disclaimers</label>
                        {name6 && <button type="button" className="clear-buttons" onClick={clearInput(setName6)}>
                            <FontAwesomeIcon className='input-close-icons' icon={faCircleXmark} />
                        </button>}
                    </div>


                    <div className={`input-wraps ${name7 ? 'has-values' : ''}`}>
                        <input type='text' className='input-5' value={name7} onChange={(e) => setName7(e.target.value)} />
                        <label>Alert if not answered</label>
                        {name7 && <button type="button" className="clear-buttons" onClick={clearInput(setName7)}>
                            <FontAwesomeIcon className='input-close-icons' icon={faCircleXmark} />
                        </button>}
                    </div>

                    {(questionType === "MCQ" || questionType === "Multiple Select") && (
                        <div className='msq-options'>
                            {options.map((option, index) => (
                                <div className='d-flex m-1' key={index}>
                                    <div className={`input-wraps ${option ? 'has-values' : ''}`}>
                                        <input type='text' className={`option-input-${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
                                        <label>{String.fromCharCode(65 + index)}</label>
                                        {option && <button type="button" className="clear-buttons" onClick={() => handleOptionChange(index, '')}>
                                            <FontAwesomeIcon className='input-close-icons' icon={faCircleXmark} />
                                        </button>}
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => canAddOption && setOptions([...options, ''])} className='btn-add-option' disabled={!canAddOption}>Add Option</button>
                        </div>
                    )}

                    <div className='d-flex justify-content-end gap-3 mt-3'>
                        <button type="button" onClick={() => setQuestionPop(false)} className='btn-closes'>Close</button>
                        <button type="button" className='btn-saves' onClick={handleSubmit}>Save</button>
                    </div>
                </form>
            </section>
        </section>
    );
};





