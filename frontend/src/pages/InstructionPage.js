import React from 'react';
import './InstructionPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

const translations = {
    english: {
        welcome: "Welcome to the Exam",
        instructionsTitle: "Instructions for the assessment",
        instruction1: "Do not refresh the page.",
        instruction2: "You can use the <strong>\"Previous\"</strong> and <strong>\"Next\"</strong> buttons to navigate between questions.",
        instruction3: "While doing the assessment you can go back and forth to the different questions at any time",
        instruction4: "Evaluation dashboard will be created after you actively finish the assessment by clicking the respective button",
        cancelButton: "Cancel",
        startButton: "Start Assessment"
    },
    german: {
        welcome: "Willkommen zur Prüfung",
        instructionsTitle: "Anweisungen für die Bewertung",
        instruction1: "Bitte die Seite nicht aktualisieren.",
        instruction2: "Sie können die Schaltflächen <strong>\"Zurück\"</strong> und <strong>\"Weiter\"</strong> verwenden, um zwischen den Fragen zu navigieren.",
        instruction3: "Während der Bewertung können Sie jederzeit zwischen den verschiedenen Fragen hin- und herwechseln",
        instruction4: "Das Bewertungs-Dashboard wird erstellt, nachdem Sie die Bewertung durch Klicken auf die jeweilige Schaltfläche aktiv abgeschlossen haben",
        cancelButton: "Abbrechen",
        startButton: "Bewertung starten"
    }
};

function InstructionPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { examName, examCategory } = state || {};

    const currentLanguage = localStorage.getItem('language') || 'english';
    const lang = translations[currentLanguage];

    const startAssessment = () => {
        navigate('/take-assessment', { state: { examName, examCategory } });
    };

    const createMarkup = (html) => {
        return { __html: html };
    };

    return (
        <div className='instruction-main container'>
            <h1>{lang.welcome}</h1>
            <h2>{examName}</h2>
            <h2>{examCategory}</h2>
            <h3 className='instruction'>{lang.instructionsTitle}</h3>
            <ul>
                <li>{lang.instruction1}</li>
                <li dangerouslySetInnerHTML={createMarkup(lang.instruction2)}></li>
                <li>{lang.instruction3}</li>
                <li>{lang.instruction4}</li>
            </ul>

            <section>
                <button className='btn-cancel' onClick={() => navigate('/landing')}>{lang.cancelButton}</button>
                <button className='btn-Start' onClick={startAssessment}>{lang.startButton}</button>
            </section>
        </div>
    );
}

export default InstructionPage;
