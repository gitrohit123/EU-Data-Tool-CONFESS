import React, { useEffect, useState, useCallback } from 'react';
import './Reports.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

function Reports() {
    const [results, setResults] = useState([]);
    const [result, setResult] = useState([]);
    const [totalTurnover, setTotalTurnover] = useState(0);
    const [totalCapex, setTotalCapex] = useState(0);
    const [totalOpex, setTotalOpex] = useState(0);
    const [Dashopop, setDashopop] = useState(true);
    const [users, setUsers] = useState([]);
    const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'english');

    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchUsers = async () => {
            const email = localStorage.getItem('email');
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/users`);
                if (response.ok) {
                    const data = await response.json();
                    const matchedUser = data.find(user => user.email === email);
                    if (matchedUser) {
                        setUsers(matchedUser);
                    } else {
                        console.error('No matching user found');
                    }
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const ChartDetails = [
        {
            title: currentLanguage === 'english' ? "Turnover" : "Umsatz",
            topic: currentLanguage === 'english' ? "EU Taxonomy alignment for Clean Energy Activities" : "EU-Taxonomie-Ausrichtung für saubere Energieaktivitäten",
            alignedValue: 0,
            notAlignedButEligibleValue: totalTurnover,
            notEligibleValue: 0
        },
        {
            title: currentLanguage === 'english' ? "CapEx" : "KapEx",
            topic: currentLanguage === 'english' ? "EU Taxonomy alignment for Clean Energy Activities" : "EU-Taxonomie-Ausrichtung für saubere Energieaktivitäten",
            alignedValue: 0,
            notAlignedButEligibleValue: totalCapex,
            notEligibleValue: 0
        },
        {
            title: currentLanguage === 'english' ? "OpEx" : "OpEx",
            topic: currentLanguage === 'english' ? "EU Taxonomy alignment for Clean Energy Activities" : "EU-Taxonomie-Ausrichtung für saubere Energieaktivitäten",
            alignedValue: 0,
            notAlignedButEligibleValue: totalOpex,
            notEligibleValue: 0
        },
        {
            title: currentLanguage === 'english' ? "# of Activities" : "# der Aktivitäten",
            topic: currentLanguage === 'english' ? "EU Taxonomy alignment for Clean Energy Activities" : "EU-Taxonomie-Ausrichtung für saubere Energieaktivitäten",
            alignedValue: 0,
            notAlignedButEligibleValue: results.length,
            notEligibleValue: 0
        }
    ];

    useEffect(() => {
        const fetchResults = async () => {
            const email = localStorage.getItem('email');
            if (!email) {
                console.error('Email not found in localStorage');
                return;
            }
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/dashboard?email=${email}`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                    setResult(data);
                } else {
                    console.error('Failed to fetch results');
                }
            } catch (error) {
                console.error('Error fetching results:', error);
            }
        };
        fetchResults();
    }, []);

    const DashResult = result.results || [];
    const TotalActivity = DashResult.length;

    return (
        <div className='d-flex justify-content-center mt-5'>
            <section className='reports-main'>
                <div className="card card-reports">
                    <div className="card-header text-start">
                        <h3 className='fw-light'>{currentLanguage === 'english' ? 'Report: CONFESS' : 'Bericht: CONFESS'}</h3>
                        <p>{currentLanguage === 'english' ? `For ${users.companyName}` : `Für ${users.companyName}`}</p>
                    </div>
                    <div className="card-body text-start">
                        <p className="card-title">
                            <i>{currentLanguage === 'english' ? 'Disclaimer: The evaluation is based on the information provided in the tool. No verifications were conducted.' : 'Haftungsausschluss: Die Bewertung basiert auf den im Tool bereitgestellten Informationen. Es wurden keine Überprüfungen durchgeführt.'}</i>
                        </p>
                        <p className="card-title mt-3">{currentLanguage === 'english' ? 'Total Number of Activities:' : 'Gesamtanzahl der Aktivitäten:'} <span>{users.totalActivity}</span></p>
                        <p className="mt-3">
                            {currentLanguage === 'english' ? 'Total Turnover: ' : 'Gesamtumsatz: '}{users.totalTurnover} $ <br />
                            {currentLanguage === 'english' ? 'Total CapEx: ' : 'Gesamt-KapEx: '}{users.totalCapex} $ <br />
                            {currentLanguage === 'english' ? 'Total OpEx: ' : 'Gesamt-OpEx: '}{users.totalOpex} $
                        </p>
                    </div>
                </div>

                <section className='section-card'>
                    {ChartDetails.map((value, index) => {
                        // Calculate percentages
                        const total = value.alignedValue + value.notAlignedButEligibleValue + value.notEligibleValue;
                        const alignedPercentage = (value.alignedValue / total) * 100;
                        const notAlignedButEligiblePercentage = (value.notAlignedButEligibleValue / total) * 100;
                        const notEligiblePercentage = (value.notEligibleValue / total) * 100;

                        return (
                            <div key={index} className='card-main'>
                                <div className="card card-stats mt-5">
                                    <div className="card-body text-start">
                                        <h3>{value.title}</h3>
                                        <p className="card-title">{value.topic}</p>
                                        <div className="circle m-4">
                                            <div className="circle-progress"
                                                style={{
                                                    background: `conic-gradient(#394D2C 0% ${alignedPercentage}%, #6CC784 ${alignedPercentage}% ${alignedPercentage + notAlignedButEligiblePercentage}%, #C4C4C4 ${alignedPercentage + notAlignedButEligiblePercentage}% 100%)`
                                                }}>
                                            </div>
                                        </div>
                                        <div className='row d-flex flex-column justify-content-between align-items-center'>
                                            <div className='col d-flex justify-content-between'>
                                                <p>{currentLanguage === 'english' ? 'Aligned' : 'Ausrichtung'}</p>
                                                <p>{value.alignedValue} $ ({alignedPercentage.toFixed(1)}%)</p>
                                            </div>
                                            <div className='col d-flex justify-content-between'>
                                                <p>{currentLanguage === 'english' ? 'Not aligned but eligible' : 'Nicht ausgerichtet, aber berechtigt'}</p>
                                                <p>{value.notAlignedButEligibleValue} $ ({notAlignedButEligiblePercentage.toFixed(1)}%)</p>
                                            </div>
                                            <div className='col d-flex justify-content-between'>
                                                <p>{currentLanguage === 'english' ? 'Not eligible' : 'Nicht berechtigt'}</p>
                                                <p>{value.notEligibleValue} $ ({notEligiblePercentage.toFixed(1)}%)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                <div className="card card-reports mt-5">
                    <div className="card-header text-start">
                        <h3 className='fw-light'>{currentLanguage === 'english' ? 'Activities in Detail' : 'Aktivitäten im Detail'}</h3>
                    </div>
                    <div className="card-body text-start">
                        <p className="card-title">
                            <i>{currentLanguage === 'english' ? 'Disclaimer: The evaluation is based on the information provided in the tool. No verifications were conducted.' : 'Haftungsausschluss: Die Bewertung basiert auf den im Tool bereitgestellten Informationen. Es wurden keine Überprüfungen durchgeführt.'}</i>
                        </p>
                        <p>{currentLanguage === 'english' ? 'Legend' : 'Legende'}</p>
                        <div className='col'>
                            <p className="mt-3 d-flex align-items-center"><span className='darkgreen-dot'></span>{currentLanguage === 'english' ? 'Criteria met' : 'Kriterien erfüllt'}</p>
                            <p className="mt-3 d-flex align-items-center"><span className='orange-dot'></span>{currentLanguage === 'english' ? 'Criteria not met' : 'Kriterien nicht erfüllt'}</p>
                            <p className="mt-3 d-flex align-items-center"><span className='darkgrey-dot'></span>{currentLanguage === 'english' ? 'Criteria not assessable' : 'Kriterien nicht beurteilbar'}</p>
                        </div>
                    </div>
                </div>

                <section>
                    {DashResult.map((value, index) => {
                        const filteredAnswers = value.answers.filter(answer => answer.questionType !== "Blank");
                        const SubstentialContribution = filteredAnswers.filter(answer => answer.questionCategory === 'Substantial Contribution');
                        const DNSHAdaption = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Adaptation');
                        const DNSHce = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - CE');
                        const DNSHwater = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Water');
                        const DNSHpollution = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Pollution');
                        const DNSHbiodibersity = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Biodiversity');

                        const AllSubstential = SubstentialContribution.every(answer =>
                            answer.answer.every(ans => ans.trim() !== "")
                        );
                        const AllDNSHAdaption = DNSHAdaption.every(answer =>
                            answer.answer.every(ans => ans.trim() !== "")
                        );
                        const AllDNSHce = DNSHce.every(answer =>
                            answer.answer.every(ans => ans.trim() !== "")
                        );
                        const AllDNSHwater = DNSHwater.every(answer =>
                            answer.answer.every(ans => ans.trim() !== "")
                        );
                        const AllDNSHpollution = DNSHpollution.every(answer =>
                            answer.answer.every(ans => ans.trim() !== "")
                        );
                        const AllDNSHbiodibersity = DNSHbiodibersity.every(answer =>
                            answer.answer.every(ans => ans.trim() !== "")
                        );

                        return (
                            <div key={value._id} className="card card-reports mt-5 text-start">
                                <div className="card-header">
                                    <h3 className='fw-light'>{currentLanguage === 'english' ? `Activity ${index + 1} - ${value.examName}` : `Aktivität ${index + 1} - ${value.examName}`}</h3>
                                </div>
                                <div className='d-flex mx-3 mt-3 justify-content-between'>
                                    <p>{currentLanguage === 'english' ? 'Substantial Contribution (Climate Change Mitigation)' : 'Substanzielle Beiträge (Klimaschutz)'}</p>
                                    <span className={AllSubstential ? 'darkgreen-dot mx-4' : 'orange-dot mx-4'}></span>
                                </div>
                                <p className="mx-3 mt-4">{currentLanguage === 'english' ? 'Do No Significant Harm' : 'Keine wesentlichen Schäden'}</p>
                                <div className='d-flex mx-3 mt-2 justify-content-between'>
                                    <p>{currentLanguage === 'english' ? 'Climate Change Adaptation' : 'Klimawandel-Anpassung'}</p>
                                    <span className={AllDNSHAdaption ? 'darkgrey-dot mx-4' : 'darkgrey-dot mx-4'}></span>
                                </div>
                                <div className='d-flex mx-3 justify-content-between'>
                                    <p>{currentLanguage === 'english' ? 'Water and Marine Protection' : 'Wasser- und Meeresschutz'}</p>
                                    <span className={AllDNSHwater ? 'darkgreen-dot mx-4' : 'orange-dot mx-4'}></span>
                                </div>
                                <div className='d-flex mx-3 justify-content-between'>
                                    <p>{currentLanguage === 'english' ? 'Circular Economy' : 'Kreislaufwirtschaft'}</p>
                                    <span className={AllDNSHce ? 'darkgreen-dot mx-4' : 'orange-dot mx-4'}></span>
                                </div>
                                <div className='d-flex mx-3 justify-content-between'>
                                    <p>{currentLanguage === 'english' ? 'Pollution Prevention' : 'Verschmutzungsprävention'}</p>
                                    <span className={AllDNSHpollution ? 'darkgreen-dot mx-4' : 'orange-dot mx-4'}></span>
                                </div>
                                <div className='d-flex mx-3 justify-content-between'>
                                    <p>{currentLanguage === 'english' ? 'Biodiversity' : 'Biodiversität'}</p>
                                    <span className={AllDNSHbiodibersity ? 'darkgreen-dot mx-4' : 'orange-dot mx-4'}></span>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {Dashopop && <DashboardPop setResults={setResults} totalTurnover={totalTurnover} totalCapex={totalCapex} totalOpex={totalOpex} TotalActivity={TotalActivity} setDashopop={setDashopop} users={users} />}
            </section>
        </div>
    );
}


export default Reports;




const DashboardPop = ({ setDashopop, users, TotalActivity, setResults }) => {
    const [turnover, setTurnover] = useState('');
    const [capex, setCapex] = useState('');
    const [opex, setOpex] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'english');

    const SaveLanguage = useCallback((language) => {
        if (currentLanguage !== language) {
            localStorage.setItem('language', language);
            setCurrentLanguage(language);
        }
    }, [currentLanguage]);

    useEffect(() => {
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', 'english');
            setCurrentLanguage('english');
        }
    }, []);

    useEffect(() => {
        if (users) {
            setTurnover(users.totalTurnover);
            setCapex(users.totalCapex);
            setOpex(users.totalOpex);
        }
    }, [users]);

    const navigate = useNavigate();

    const closeThePop = () => {
        setDashopop(false);
    };

    const GoHome = () => {
        navigate('/landing');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            totalTurnover: parseFloat(turnover),
            totalCapex: parseFloat(capex),
            totalOpex: parseFloat(opex),
        };

        try {
            console.log("Sending updated data:", updatedData);
            const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/users/${users._id}/financial-data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log("Received response:", updatedUser);
                setResults(updatedUser);
                setDashopop(false);
            } else {
                console.error('Failed to update data');
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const content = {
        english: {
            heading: 'Update Total Turnover, CapEx, OpEx',
            paragraphs: [
                'Reporting in accordance with the EU taxonomy indicates the proportion of taxonomy eligible and taxonomy aligned economic activities.',
                'In order to determine their monetary value, the share of taxonomy eligible and taxonomy-aligned activities in turnover, CapEx and OpEx is calculated and reported. To calculate this, we need to know your total turnover, CapEx and OpEx of the last fiscal year. We also need to know the total number of economic activities your company performs.',
                'If you do not know and cannot collect the exact total financials of the last year, please estimate:',
            ],
            labels: {
                turnover: 'Total Turnover',
                capex: 'Total Capex',
                opex: 'Total OpEx',
                totalActivities: 'Total Activities',
                cancel: 'Cancel',
                submit: 'Submit',
            }
        },
        german: {
            heading: 'Gesamtumsatz, CapEx, OpEx aktualisieren',
            paragraphs: [
                'Die Berichterstattung gemäß der EU-Taxonomie gibt den Anteil der taxonomie-eligiblen und taxonomie-konformen Wirtschaftstätigkeiten an.',
                'Um deren monetären Wert zu bestimmen, wird der Anteil der taxonomie-eligiblen und taxonomie-konformen Aktivitäten an Umsatz, CapEx und OpEx berechnet und berichtet. Um dies zu berechnen, müssen wir Ihren Gesamtumsatz, CapEx und OpEx des letzten Geschäftsjahres kennen. Wir müssen auch die Gesamtzahl der von Ihrem Unternehmen ausgeführten Wirtschaftstätigkeiten kennen.',
                'Wenn Sie die genauen Gesamtdaten des letzten Jahres nicht kennen und nicht sammeln können, schätzen Sie bitte:',
            ],
            labels: {
                turnover: 'Gesamtumsatz',
                capex: 'Gesamt Capex',
                opex: 'Gesamt OpEx',
                totalActivities: 'Gesamtaktivitäten',
                cancel: 'Abbrechen',
                submit: 'Einreichen',
            }
        }
    };

    const { heading, paragraphs, labels } = content[currentLanguage];

    return (
        <div className='Dash-pop'>
            <section>
                <h4>{heading}</h4>
                {paragraphs.map((p, index) => <p key={index}>{p}</p>)}
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <div className={`input-wraps-dash ${turnover ? 'has-values' : ''}`}>
                            <input
                                type='number'
                                className='input-turnover'
                                value={turnover}
                                onChange={(e) => setTurnover(parseFloat(e.target.value) || 0)}
                            />
                            <label>{labels.turnover} <span className='text-danger'>*</span></label>
                            <FontAwesomeIcon icon={faEuroSign} className='euro-signs' />
                        </div>
                        <div className={`input-wraps-dash ${capex ? 'has-values' : ''}`}>
                            <input
                                type='number'
                                className='input-capex'
                                value={capex}
                                onChange={(e) => setCapex(parseFloat(e.target.value) || 0)}
                            />
                            <label>{labels.capex} <span className='text-danger'>*</span></label>
                            <FontAwesomeIcon icon={faEuroSign} className='euro-signs' />
                        </div>
                        <div className={`input-wraps-dash ${opex ? 'has-values' : ''}`}>
                            <input
                                type='number'
                                className='input-opex'
                                value={opex}
                                onChange={(e) => setOpex(parseFloat(e.target.value) || 0)}
                            />
                            <label>{labels.opex} <span className='text-danger'>*</span></label>
                            <FontAwesomeIcon icon={faEuroSign} className='euro-signs' />
                        </div>
                        <div className={`input-wraps-dash ${TotalActivity ? 'has-values' : ''}`}>
                            <input
                                type='number'
                                className='input-totalact'
                                value={TotalActivity}
                            />
                            <label>{labels.totalActivities} <span className='text-danger'>*</span></label>
                        </div>
                    </div>
                    <div className='Dash-submit-buttons'>
                        <button type="button" onClick={GoHome} className='btn btn-secondary'>{labels.cancel}</button>
                        <button type="submit" className='btn btn-primary'>{labels.submit}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};








