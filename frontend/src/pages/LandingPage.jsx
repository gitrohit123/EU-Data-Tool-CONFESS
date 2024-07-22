import React, { useEffect, useState, useCallback } from 'react';
import '../pages/LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const translations = {
    english: {
        title: "Selection of Activities",
        description: "From this list of activity types, please select the activity type to which the activity you like to check for taxonomy alignment matches. Once you have finished performing an activity assessment, you will be taken back to this page so that you can subsequently complete other activities of the same or a different type. The evaluation of the taxonomy alignment of your activities can be found in the Dashboard section. As soon as you complete the assessment for a new activity, the dashboard is automatically updated.",
        startButton: "Start Evaluation",
        category: "Category:"
    },
    german: {
        title: "Auswahl von Aktivitäten",
        description: "Wählen Sie aus dieser Liste von Aktivitätstypen den Typ der Aktivität aus, den Sie auf Taxonomieübereinstimmung überprüfen möchten. Nachdem Sie eine Aktivitätseinschätzung abgeschlossen haben, werden Sie zu dieser Seite zurückgebracht, damit Sie anschließend andere Aktivitäten desselben oder eines anderen Typs abschließen können. Die Bewertung der Taxonomieübereinstimmung Ihrer Aktivitäten finden Sie im Dashboard-Bereich. Sobald Sie die Bewertung für eine neue Aktivität abgeschlossen haben, wird das Dashboard automatisch aktualisiert.",
        startButton: "Bewertung starten",
        category: "Kategorie:"
    }
};

const LandingPage = () => {
    const [assessments, setAssessments] = useState([]);
    const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'english');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    const fetchAssessments = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchAssessments();
    }, [fetchAssessments]);

    const startButton = (examName, examCategory) => {
        navigate('/instructions', { state: { examName, examCategory } });
    };

    const changeLanguage = (language) => {
        if (currentLanguage !== language) {
            localStorage.setItem('language', language);
            setCurrentLanguage(language);
        }
    };

    const lang = translations[currentLanguage];

    // Filter assessments based on the selected language
    const filteredAssessments = assessments.filter(
        assessment => assessment.language === currentLanguage
    );

    // Get unique categories from filtered assessments
    const uniqueCategories = ['All', ...new Set(filteredAssessments.map(assessment => assessment.examCategory))];

    // Further filter assessments based on selected category
    const categoryFilteredAssessments = selectedCategory === 'All'
        ? filteredAssessments
        : filteredAssessments.filter(assessment => assessment.examCategory === selectedCategory);

    return (
        <div className='mt-5 d-flex justify-content-center align-items-center landing-page'>
            <section className='landing-main'>
                <h2>{lang.title}</h2>
                <h5 className='activity-text'>
                    <FontAwesomeIcon icon={faInfoCircle} /> {lang.description}
                </h5>

                {/* Category buttons */}
                <div className='category-nav mt-5 text-start'>
                    {uniqueCategories.map(category => (
                        <button
                            key={category}
                            className={`nav-button ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Assessments cards */}
                <div className='cards-main'>
                    {categoryFilteredAssessments.map((assessment) => (
                        <div className="card" key={assessment._id}>
                            <div className='card-body'>
                                <h5 className="card-text">{assessment.examName}</h5>
                                <div className="card-title h5">{lang.category} {assessment.examCategory}</div>
                                <button onClick={() => startButton(assessment.examName, assessment.examCategory)} type="button" className="btn-2">{lang.startButton}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
