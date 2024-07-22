import React, { useEffect, useState, useCallback } from 'react';
import LogoLight from "../asset/logo_light.png";
import '../pages/Home.css';

const LanguageSelector = ({ SaveLanguage, currentLanguage }) => (
  <div className="p-2 bg-secondary" style={{ borderRadius: "10px" }}>
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          {currentLanguage === 'english' ? 'Select Language' : 'Sprache auswählen'}
        </a>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#" onClick={() => SaveLanguage('english')}>English</a></li>
          <li><a className="dropdown-item" href="#" onClick={() => SaveLanguage('german')}>German</a></li>
        </ul>
      </li>
    </ul>
  </div>
);

const Content = ({ currentLanguage }) => {
  const content = {
    english: {
      heading: 'Welcome to the EU Data Tool',
      paragraphs: [
        'Our aim is to support (in particular smaller) companies in their sustainability reporting based on the EU Taxonomy.',
        'The EU Taxonomy provides a standardized framework for classifying environmentally sustainable economic activities and is intended to help direct capital flows into such sustainable economic activities.',
        'Our tool offers you the opportunity to get an initial overview of the taxonomy conformity of your activities, while at the same time familiarizing you with the requirements of the EU taxonomy. In addition, the tool offers a detailed evaluation of your data and, if desired, a review by our experts or independent third parties.',
        'If you are new to taxonomy reporting, we recommend starting with the self-assessment. You can upgrade to the other options at any time.'
      ],
      cards: [
        { title: 'Self-Assessment', text: 'Use the self-assessment to familiarize yourself with the requirements of the EU taxonomy for your economic activities and to get an initial overview of the potential taxonomy alignment of your activities.', btnClass: 'btn-1', link: '/login' },
        { title: 'Expert Check', text: 'Our experts check your statements in the self-assessment and verify the taxonomy alignment of your activities based on additional documents you upload as proof of your statements.', btnClass: 'btn-5', link: '#' },
        { title: '3rd Party Verification', text: 'An independent third party checks your statements in the self-assessment and verifies the taxonomy alignment of your activities based on additional documents you upload as proof of your statements.', btnClass: 'btn-5', link: '#' }
      ]
    },
    german: {
      heading: 'Willkommen beim EU-Datentool',
      paragraphs: [
        'Unser Ziel ist es, (insbesondere kleinere) Unternehmen bei ihrer Nachhaltigkeitsberichterstattung auf Basis der EU-Taxonomie zu unterstützen.',
        'Die EU-Taxonomie bietet einen standardisierten Rahmen für die Klassifizierung ökologisch nachhaltiger Wirtschaftsaktivitäten und soll dazu beitragen, Kapitalströme in solche nachhaltigen Wirtschaftsaktivitäten zu lenken.',
        'Unser Tool bietet Ihnen die Möglichkeit, sich einen ersten Überblick über die Taxonomiekonformität Ihrer Aktivitäten zu verschaffen und sich gleichzeitig mit den Anforderungen der EU-Taxonomie vertraut zu machen. Darüber hinaus bietet das Tool eine detaillierte Auswertung Ihrer Daten und auf Wunsch eine Überprüfung durch unsere Experten oder unabhängige Dritte.',
        'Wenn Sie neu in der Taxonomie-Berichterstattung sind, empfehlen wir, mit der Selbstbewertung zu beginnen. Sie können jederzeit auf die anderen Optionen upgraden.'
      ],
      cards: [
        { title: 'Selbsteinschätzung', text: 'Nutzen Sie das Self-Assessment, um sich mit den Anforderungen der EU-Taxonomie für Ihre Wirtschaftsaktivitäten vertraut zu machen und sich einen ersten Überblick über die mögliche Taxonomieausrichtung Ihrer Aktivitäten zu verschaffen.', btnClass: 'btn-1', link: '/login' },
        { title: 'Expertencheck', text: 'Unsere Experten prüfen Ihre Aussagen im Self-Assessment und verifizieren die Taxonomie-Ausrichtung Ihrer Aktivitäten anhand zusätzlicher Dokumente, die Sie als Nachweis Ihrer Aussagen hochladen.', btnClass: 'btn-5', link: '#' },
        { title: 'Verifizierung durch Dritte', text: 'Ein unabhängiger Dritter prüft Ihre Aussagen im Self-Assessment und verifiziert die Taxonomie-Ausrichtung Ihrer Aktivitäten anhand zusätzlicher Dokumente, die Sie als Nachweis Ihrer Aussagen hochladen.', btnClass: 'btn-5', link: '#' }
      ]
    }
  };

  const { heading, paragraphs, cards } = content[currentLanguage];

  return (
    <>
      <h1 className='mt-3 fw-normal'>{heading}</h1>
      <div className='text-start mt-5'>
        {paragraphs.map((p, index) => <p key={index}>{p}</p>)}
      </div>
      <div className='mt-5 d-flex justify-content-center gap-5'>
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <div className="card-body d-flex flex-column justify-content-between align-items-center">
              <h5 className="card-title fs-5 text-start">{card.title}</h5>
              <p className="card-text mt-4 text-start">{card.text}</p>
              <a href={card.link} className={card.btnClass}>Choose Option</a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

function Home() {
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'english');

  const SaveLanguage = useCallback((language) => {
    if (currentLanguage !== language) {
      localStorage.setItem('language', language);
      setCurrentLanguage(language); // Update the state
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'english');
      setCurrentLanguage('english');
    }
  }, []);

  return (
    <div className='home d-flex justify-content-center'>
      <div className='home-main'>
        <div className='d-flex justify-content-around align-items-center bg-secondary mt-2' style={{ borderRadius: "10px 10px 0px 0px" }}>
          <img src={LogoLight} alt='logo' />
          <LanguageSelector SaveLanguage={SaveLanguage} currentLanguage={currentLanguage} />
        </div>
        <Content currentLanguage={currentLanguage} />
      </div>
    </div>
  );
}

export default Home;
