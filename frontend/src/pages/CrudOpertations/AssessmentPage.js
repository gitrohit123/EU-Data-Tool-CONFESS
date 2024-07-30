import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AssessmentPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AssessmentPage() {
    const { state } = useLocation();
    const { examName, examCategory } = state || {};
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    const [currentQuestionIDs, setCurrentQuestionIDs] = useState([]);
    const [questionHistory, setQuestionHistory] = useState([]);
    const [savedOptions, setSavedOptions] = useState([]);
    const [allCurrentQuestions, setAllCurrentQuestions] = useState([]);
    const [savedPreviousQuestions, setSavedPreviousQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://confess-data-tool-backend-beta.vercel.app/api/assessments/${examName}/questions`);
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data);
                    if (data.length > 0) {
                        setCurrentQuestionIDs([data[0].questionID]);
                        setQuestionHistory([[data[0].questionID]]);
                        setAllCurrentQuestions([data[0]]);
                    }
                } else {
                    console.error('Failed to fetch questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [examName]);



    const handleNextQuestion = () => {

        const newQuestionIDs = [];
        let addHello = false;
        let savedque = [];
        let shouldProceed = true;
        currentQuestionIDs.forEach(id => {
            const currentQuestion = questions.find(q => q.questionID === id);
            const answer = answers[currentQuestion.questionID] || '';
            if (
                currentQuestion &&
                ['MCQ', 'Multiple Select', 'Short', 'Long Text', 'Numerical Value', 'Year'].includes(currentQuestion.questionType) &&
                currentQuestion.alertText && // Check if alertText key exists
                (
                    (currentQuestion.questionType === 'MCQ' && !answer) ||
                    (currentQuestion.questionType === 'Multiple Select' && (!answer || answer.length === 0)) ||
                    (currentQuestion.questionType === 'Short' && !answer) ||
                    (currentQuestion.questionType === 'Long Text' && !answer) ||
                    (currentQuestion.questionType === 'Numerical Value' && !answer) ||
                    (currentQuestion.questionType === 'Year' && !answer)
                )
            ) {
                alert(currentQuestion.alertText);
                shouldProceed = false;
            }



            if (
                currentQuestion &&
                ['MCQ', 'Multiple Select', 'Short', 'Long Text', 'Numerical Value', 'Year'].includes(currentQuestion.questionType) &&
                currentQuestion.notifytext &&
                (
                    (currentQuestion.questionType === 'MCQ' && answer) ||
                    (currentQuestion.questionType === 'Multiple Select' && answer) ||
                    (currentQuestion.questionType === 'Short' && answer) ||
                    (currentQuestion.questionType === 'Long Text' && answer) ||
                    (currentQuestion.questionType === 'Numerical Value' && answer) ||
                    (currentQuestion.questionType === 'Year' && answer)
                )
            ) {
                console.log(currentQuestion.notifytext);
                toast.info(currentQuestion.notifytext, {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'light',
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });
            }


            if (currentQuestion && currentQuestion.nextQuestions) {
                if (currentQuestion.questionType === 'MCQ' && currentQuestion.options.includes('Yes') && currentQuestion.options.includes('No')) {
                    let selectedAnswer = answers[currentQuestion.questionID];

                    const nextQuestionsArray = currentQuestion.nextQuestions.split(',').map(q => q.trim());
                    console.log('selectedAnswer:', selectedAnswer);
                    console.log('nextQuestionsArray:', nextQuestionsArray);

                    if (selectedAnswer === 'Yes' && nextQuestionsArray.length >= 1) {
                        newQuestionIDs.push(nextQuestionsArray[0]);
                        console.log("Next question for Yes:", nextQuestionsArray[0]);
                    } else if (selectedAnswer === 'No' && nextQuestionsArray.length >= 1) {
                        newQuestionIDs.push(nextQuestionsArray[1]);
                        console.log("Next question for No:", nextQuestionsArray[1]);
                    }
                    else {
                        newQuestionIDs.push(...currentQuestion.nextQuestions.split(',').map(q => q.trim()));
                    }
                }

                else if (currentQuestion.questionType === 'MCQ' && currentQuestion.options.includes('Ja') && currentQuestion.options.includes('Nein')) {
                    let selectedAnswer = answers[currentQuestion.questionID];

                    const nextQuestionsArray = currentQuestion.nextQuestions.split(',').map(q => q.trim());
                    console.log('selectedAnswer:', selectedAnswer);
                    console.log('nextQuestionsArray:', nextQuestionsArray);

                    if (selectedAnswer === 'Ja' && nextQuestionsArray.length >= 1) {
                        newQuestionIDs.push(nextQuestionsArray[0]);
                        console.log("Next question for Yes:", nextQuestionsArray[0]);
                    } else if (selectedAnswer === 'Nein' && nextQuestionsArray.length >= 1) {
                        newQuestionIDs.push(nextQuestionsArray[1]);
                        console.log("Next question for No:", nextQuestionsArray[1]);
                    }
                    else {
                        newQuestionIDs.push(...currentQuestion.nextQuestions.split(',').map(q => q.trim()));
                    }
                }

                else if (currentQuestion.questionType === 'Numerical Value' && currentQuestion.options) {
                    let GivenAnswer = answers[currentQuestion.questionID];

                    if (!GivenAnswer) {
                        GivenAnswer = 0;
                    }
                    GivenAnswer = Number(GivenAnswer);
                    const threshold = Number(currentQuestion.options[0]);
                    console.log(GivenAnswer);
                    console.log(threshold);
                    const nextQuestionsArray = currentQuestion.nextQuestions.split(',').map(q => q.trim());
                    if (GivenAnswer < threshold && nextQuestionsArray.length >= 1) {
                        newQuestionIDs.push(nextQuestionsArray[0]);
                        console.log("Lower");
                    } else if (GivenAnswer >= threshold && nextQuestionsArray.length >= 1) {
                        newQuestionIDs.push(nextQuestionsArray[1]);
                        console.log("Higher");
                    }
                    else {
                        newQuestionIDs.push(...currentQuestion.nextQuestions.split(',').map(q => q.trim()));
                    }

                }
                else {
                    newQuestionIDs.push(...currentQuestion.nextQuestions.split(',').map(q => q.trim()));
                }
            }


            const prevQuestion = questions.find(q => q.questionID === id);
            if (prevQuestion && prevQuestion.questionType === 'Multiple Select') {
                addHello = true; // Set flag to true to add Hello to the next question
                const savedOptionsForCurrentQuestion = savedOptions[prevQuestion.questionID];

                if (savedOptionsForCurrentQuestion && savedOptionsForCurrentQuestion.length > 0) {
                    savedque = savedOptionsForCurrentQuestion.map(opt => opt.value1 || opt.value0);
                }
            }
        });

        if (shouldProceed) { // Only proceed if no alert was shown
            const nextQuestions = newQuestionIDs.map(id => questions.find(q => q.questionID === id));
            setAllCurrentQuestions(prev => [...prev, ...nextQuestions.filter(Boolean)]);

            setCurrentQuestionIDs(newQuestionIDs);
            setQuestionHistory(prevHistory => [...prevHistory, newQuestionIDs]);

            if (addHello && newQuestionIDs.length > 0) {
                const nextQuestionID = newQuestionIDs[0];
                const nextQuestionIndex = questions.findIndex(q => q.questionID === nextQuestionID);

                if (nextQuestionIndex !== -1) {
                    const nextQuestion = questions[nextQuestionIndex];

                    const savedPrevQuestion = savedPreviousQuestions.find(q => q.id === nextQuestionIndex);
                    const saveThisIfUndefined = nextQuestion.question;

                    if(savedPrevQuestion === undefined) {
                        setSavedPreviousQuestions(prevQuestions => [...prevQuestions, { id: nextQuestionIndex, question: saveThisIfUndefined }]);
                    }

                    const allValues = savedque.flatMap(item => item.split('¦').map(s => s.trim()));
                    const uniqueValues = Array.from(new Set(allValues));
                    const combinedSavedque = uniqueValues.map(item => `<li>${item}</li>`).join(' ');
                    if(savedPrevQuestion === undefined) {
                        nextQuestion.question = `${nextQuestion.question} ${combinedSavedque}`;
                    } else {
                        nextQuestion.question = `${savedPrevQuestion.question} ${combinedSavedque}`;
                    }
                    setQuestions([...questions]);
                }
            }
        }



    };


    const handlePreviousQuestion = () => {
        if (questionHistory.length > 1) {
            const newHistory = [...questionHistory];
            newHistory.pop();
            const previousQuestionIDs = newHistory[newHistory.length - 1];
            setCurrentQuestionIDs(previousQuestionIDs);
            setQuestionHistory(newHistory);
        }
    };

    const currentQuestions = questions.filter(q => currentQuestionIDs.includes(q.questionID));

    if (!currentQuestions.length) {
        return <div>Loading...</div>;
    }

    const handleAnswerChange = (questionID, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionID]: answer,
        }));
    };

    const handleMultipleSelectChange = (questionID, optionValue0, optionValue1, isChecked) => {
        setAnswers(prevAnswers => {
            const prevAnswer = prevAnswers[questionID] || [];
            let updatedAnswer;
            if (isChecked) {
                updatedAnswer = [...prevAnswer, { value0: optionValue0, value1: optionValue1 }];
            } else {
                updatedAnswer = prevAnswer.filter(ans => ans.value0 !== optionValue0);
            }
            return {
                ...prevAnswers,
                [questionID]: updatedAnswer,
            };
        });

        if (optionValue1) {
            setSavedOptions(prevSavedOptions => {
                const prevOptions = prevSavedOptions[questionID] || [];
                let updatedOptions;
                if (isChecked) {
                    updatedOptions = [...prevOptions, { value0: optionValue0, value1: optionValue1 }];
                } else {
                    updatedOptions = prevOptions.filter(opt => opt.value0 !== optionValue0);
                }
                return {
                    ...prevSavedOptions,
                    [questionID]: updatedOptions,
                };
            });
        }
    };



    const saveResults = async () => {
        const userEmail = localStorage.getItem('email');
        try {
            // Accumulate all question IDs in allCurrentQuestions
            const questionIDs = allCurrentQuestions.map(question => question.questionID);
            // Filter out duplicate question IDs
            const uniqueQuestionsMap = new Map();
            allCurrentQuestions.forEach(question => {
                if (!uniqueQuestionsMap.has(question.questionID)) {
                    uniqueQuestionsMap.set(question.questionID, question);
                }
            });
            const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
            const uniqueQuestionIDs = Array.from(uniqueQuestionsMap.keys());

            // Loop through each unique question and format the answers
            const formattedAnswers = uniqueQuestions.map(question => {
                const currentAnswer = answers[question.questionID];
                const questionCategory = question.questionCategory;
                const questionType = question.questionType;
                // Format the answer appropriately
                if (Array.isArray(currentAnswer)) {
                    return {
                        questionID: question.questionID,
                        questionCategory,
                        answer: currentAnswer.length > 0 ? currentAnswer.map(a => `${a.value0},${a.value1}`).join(';') : ''
                    };
                } else {
                    return {
                        questionID: question.questionID,
                        questionCategory,
                        questionType,
                        answer: currentAnswer || ''
                    };
                }
            });

            // Send the data to the backend
            const response = await fetch('https://confess-data-tool-backend-beta.vercel.app/api/results/submitresults', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ examName, examCategory, userEmail, answers: formattedAnswers, questionIDs: uniqueQuestionIDs })
            });

            if (response.ok) {
                alert("Your answers are submitted");
                navigate('/landing');
            } else {
                const errorData = await response.json();
                console.error('Failed to save results', errorData);
                alert(`Failed to save results: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };


    const renderQuestionInput = (question) => {
        const savedAnswer = answers[question.questionID];
        switch (question.questionType) {
            case 'MCQ':
                return (
                    <>
                        {question.options.filter(option => option).map((option, index) => (
                            <div key={index} className='fs-6'>
                                <input
                                    type="radio"
                                    className='m-1 form-check-input'
                                    name={`question-${question.questionID}`}
                                    value={option}
                                    checked={savedAnswer === option}
                                    onChange={() => handleAnswerChange(question.questionID, option)}
                                />
                                {option}
                            </div>
                        ))}
                    </>
                );
            case 'Multiple Select':
                return (
                    <>
                        {question.options.filter(option => option).map((option, index) => {
                            const optionValue = option.split('#');

                            return (
                                <div key={index} className='fs-6'>
                                    <input
                                        type="checkbox"
                                        className='m-1 form-check-input'
                                        name={`question-${question.questionID}`}
                                        value={optionValue[0]}
                                        checked={savedAnswer && savedAnswer.some(ans => ans.value0 === optionValue[0])}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            handleMultipleSelectChange(question.questionID, optionValue[0], optionValue[1], isChecked);
                                        }}
                                    />
                                    {optionValue[0]}
                                </div>
                            );
                        })}
                    </>
                );

            case 'Short':
                return (
                    <textarea
                        className='input-4 border-secondary text-secondary w-100'
                        name={`question-${question.questionID}`}
                        value={savedAnswer || ''}
                        onChange={(e) => handleAnswerChange(question.questionID, e.target.value)}
                    />
                );

            case 'Long Text':
                return (
                    <textarea
                        className='input-4 border-secondary text-secondary w-100'
                        name={`question-${question.questionID}`}
                        value={savedAnswer || ''}
                        onChange={(e) => handleAnswerChange(question.questionID, e.target.value)}
                    />
                );
            case 'Numerical Value':
                return (
                    <div className='numerical'>
                        <input
                            type="number"
                            className='input-4 border-secondary text-secondary w-100'
                            name={`question-${question.questionID}`}
                            value={savedAnswer || ''}
                            onChange={(e) => handleAnswerChange(question.questionID, e.target.value)}
                        />
                        <FontAwesomeIcon
                            icon={faEuroSign}
                            className='euro-sign'
                        />
                    </div>
                );
            case 'Year':
                return (
                    <div className='numerical'>
                        <input
                            type="number"
                            className='input-4 border-secondary text-secondary w-100'
                            name={`question-${question.questionID}`}
                            value={savedAnswer || ''}
                            max="9999" // Ensure maximum year value is set
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,4}$/.test(value)) { // Only allow up to 4 digits
                                    handleAnswerChange(question.questionID, value);
                                }
                            }}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    const isLastQuestion = currentQuestions.some(question => question.nextQuestions === 'end');
    const excludedCategories = ['Turnover', 'Capex', 'OpEx', 'Blank'];
    const currentCategory = currentQuestions[0]?.questionCategory;

    return (
        <div className='assessment-page container mt-5 py-5'>
            <h4>{examName}</h4>
            {excludedCategories.includes(currentCategory) ? '' : <h4 className='container bg-secondary text-white p-2' style={{ borderRadius: "10px 10px 0px 0px" }}>{currentCategory}</h4>}


            {currentQuestions.map(question => (
                <div key={question.questionID} className='question text-start'>
                    <p className='mt-5' dangerouslySetInnerHTML={{ __html: question.question }}></p>
                    {renderQuestionInput(question)}
                    <p className='mt-3'><i>{question.disclaimer}</i></p>
                </div>
            ))}

            <div className='navigation-buttons d-flex justify-content-between mt-5'>
                <button
                    className='btn-cancel'
                    onClick={() => {
                        if (questionHistory.length <= 1) {
                            navigate('/instructions', { state: { examName, examCategory } });
                        } else {
                            handlePreviousQuestion();
                        }
                    }}
                >
                    {questionHistory.length <= 1 ? 'Cancel' : 'Previous'}
                </button>
                {isLastQuestion ? (
                    <button
                        className='btn-cancel'
                        onClick={saveResults}
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        className='btn-cancel'
                        onClick={handleNextQuestion}
                    >
                        Next
                    </button>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default AssessmentPage;


const Tooltip = ({ text, tooltipText }) => {
    const [hover, setHover] = useState(false);

    return (
        <span
            className="tooltip-container"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {text}
            {hover && <span className="tooltip">{tooltipText}</span>}
        </span>
    );
};
