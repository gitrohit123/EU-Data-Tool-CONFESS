import React, { useEffect, useState, useCallback, useRef } from 'react';
import './Reports.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const [reloaddash, setreloaddash] = useState(false);

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
                const response = await fetch(`https://confess-data-tool-backend-beta.vercel.app/api/users`);
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
    }, [reloaddash]);




    useEffect(() => {
        const fetchResults = async () => {
            const email = localStorage.getItem('email');
            if (!email) {
                console.error('Email not found in localStorage');
                return;
            }
            try {
                const response = await fetch(`https://confess-data-tool-backend-beta.vercel.app/api/dashboard?email=${email}`);
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

    const [alignedValue, setAlignedValue] = useState([]);
    const [notAlignedButEligibleValue, setNotAlignedButEligibleValue] = useState([]);
    const [NotEligible, setNotEligible] = useState([]);

    const prevAlignedValueRef = useRef([]);
    const prevNotAlignedButEligibleValueRef = useRef([]);
    const prevNotEligibleRef = useRef([]);



    useEffect(() => {
        prevAlignedValueRef.current = alignedValue;
        prevNotAlignedButEligibleValueRef.current = notAlignedButEligibleValue;
        prevNotEligibleRef.current = NotEligible;
    }, [alignedValue, notAlignedButEligibleValue, NotEligible]);

    const FinalAligned = prevAlignedValueRef.current;
    const FinalNotAligned = prevNotAlignedButEligibleValueRef.current;
    const FineaNotEligible = prevNotEligibleRef.current;



    const AlignedturnoverAnswers = FinalAligned.map(item =>
        item.answers.find(answer => answer.questionCategory === 'Turnover')
    ).map(answer => answer ? parseFloat(answer.answer[0]) : 0);
    const AlignedTurnover = AlignedturnoverAnswers.reduce((acc, val) => acc + val, 0);


    const NotAlignedturnoverAnswers = FinalNotAligned.map(item =>
        item.answers.find(answer => answer.questionCategory === 'Turnover')
    ).map(answer => answer ? parseFloat(answer.answer[0]) : 0);
    const NotAlignedTurnover = NotAlignedturnoverAnswers.reduce((acc, val) => acc + val, 0);


    const NotEligibleturnoverAnswers = FineaNotEligible.map(item =>
        item.answers.find(answer => answer.questionCategory === 'Turnover')
    ).map(answer => answer ? parseFloat(answer.answer[0]) : 0);
    const NotEligibleTurnover = users.totalTurnover - AlignedTurnover - NotAlignedTurnover;


    const AlignedcapexAnswers = FinalAligned.map(item =>
        item.answers.find(answer => answer.questionCategory === 'CapEx')
    ).map(answer => answer ? parseFloat(answer.answer[0]) : 0);
    const AlignedCapEx = AlignedcapexAnswers.reduce((acc, val) => acc + val, 0);


    const NotAlignedcapexAnswers = FinalNotAligned.map(item =>
        item.answers.find(answer => answer.questionCategory === 'CapEx')
    ).map(answer => answer ? parseFloat(answer.answer[0]) : 0);
    const NotAlignedCapEx = NotAlignedcapexAnswers.reduce((acc, val) => acc + val, 0);


    const NotEligiblecapexAnswers = FineaNotEligible.map(item =>
        item.answers.find(answer => answer.questionCategory === 'CapEx')
    ).map(answer => answer ? parseFloat(answer.answer[0]) : 0);
    const NotEligibleCapEx = users.totalCapex - AlignedCapEx - NotAlignedCapEx;


    const AlignedopexAnswers = FinalAligned.map(item =>
        item.answers.find(answer => answer.questionCategory === 'OpEx')
    ).map(answer => answer ? parseFloat(answer.answer[0]) : 0);
    const AlignedOpEx = AlignedopexAnswers.reduce((acc, val) => acc + val, 0);

    const NotAlignedopexAnswers = FinalNotAligned.map(item =>
        item.answers.find(answer => answer.questionCategory === 'OpEx')
    ).map(answer => answer ? parseFloat(answer.answer[0]) : 0);
    const NotAlignedOpEx = NotAlignedopexAnswers.reduce((acc, val) => acc + val, 0);


    const NotEligibleopexAnswers = FineaNotEligible.map(item =>
        item.answers.find(answer => answer.questionCategory === 'OpEx')
    ).map(answer => answer ? parseFloat(answer.answer[0]) : 0);
    const NotEligibleOpEx = users.totalOpex - AlignedOpEx - NotAlignedOpEx;


    const ChartDetails = [
        {
            title: currentLanguage === 'english' ? "Turnover" : "Umsatz",
            topic: currentLanguage === 'english' ? "EU Taxonomy alignment for Clean Energy Activities" : "EU-Taxonomie-Ausrichtung für saubere Energieaktivitäten",
            alignedValue: AlignedTurnover,
            notAlignedButEligibleValue: NotAlignedTurnover,
            notEligibleValue: NotEligibleTurnover,
            showCurrency: true,
        },
        {
            title: currentLanguage === 'english' ? "CapEx" : "CapEx (Investitionskosten)",
            topic: currentLanguage === 'english' ? "EU Taxonomy alignment for Clean Energy Activities" : "EU-Taxonomie-Ausrichtung für saubere Energieaktivitäten",
            alignedValue: AlignedCapEx,
            notAlignedButEligibleValue: NotAlignedCapEx,
            notEligibleValue: NotEligibleCapEx,
            showCurrency: true,
        },
        {
            title: currentLanguage === 'english' ? "OpEx" : "OpEx (Betriebskosten)",
            topic: currentLanguage === 'english' ? "EU Taxonomy alignment for Clean Energy Activities" : "EU-Taxonomie-Ausrichtung für saubere Energieaktivitäten",
            alignedValue: AlignedOpEx,
            notAlignedButEligibleValue: NotAlignedOpEx,
            notEligibleValue: NotEligibleOpEx,
            showCurrency: true,
        },
        {
            title: currentLanguage === 'english' ? "# of Activities" : "# der Aktivitäten",
            topic: currentLanguage === 'english' ? "EU Taxonomy alignment for Clean Energy Activities" : "EU-Taxonomie-Ausrichtung für saubere Energieaktivitäten",
            alignedValue: FinalAligned.length,
            notAlignedButEligibleValue: FinalNotAligned.length,
            notEligibleValue: users.totalActivity - FinalAligned.length - FinalNotAligned.length,
            showCurrency: false,
        }
    ];

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
                        <p className="card-title mt-3">{currentLanguage === 'english' ? 'Total Number of Activities:' : 'Anzahl aller Unternehmensaktivitäten:'} <span>{users.totalActivity}</span></p>
                        <p className="mt-3">
                            {currentLanguage === 'english' ? 'Total Turnover: ' : 'Umsatz (gesamt): '}{users.totalTurnover} € <br />
                            {currentLanguage === 'english' ? 'Total CapEx: ' : 'CapEx (gesamt): '}{users.totalCapex} € <br />
                            {currentLanguage === 'english' ? 'Total OpEx: ' : 'OpEx (gesamt): '}{users.totalOpex} €
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
                                <div className="card card-stats">
                                    <div className="card-body text-start">
                                        <h4>{value.title}</h4>
                                        <p className="card-title">{value.topic}</p>

                                        <div className="circle m-4">
                                            <div className="circle-progress"
                                                style={{
                                                    background: `conic-gradient(#6CC784 0% ${alignedPercentage}%,  #C4C4C4 ${alignedPercentage}% ${alignedPercentage + notAlignedButEligiblePercentage}%, #394D2C ${alignedPercentage + notAlignedButEligiblePercentage}% 100%)`
                                                }}>
                                            </div>
                                        </div>

                                        <div className='row d-flex flex-column justify-content-between align-items-center'>
                                            <div className='col d-flex justify-content-between'>
                                                <p><span className='green-dot'></span>{currentLanguage === 'english' ? 'Aligned' : 'Taxonomiekonform'}</p>
                                                <p>{value.alignedValue} {value.showCurrency ? '€' : ''} ({alignedPercentage.toFixed(1)}%)</p>
                                            </div>
                                            <div className='col d-flex justify-content-between'>
                                                <p><span className='grey-dot'></span>{currentLanguage === 'english' ? 'Not aligned but eligible' : 'Taxonomiefähig'}</p>
                                                <p>{value.notAlignedButEligibleValue} {value.showCurrency ? '€' : ''} ({notAlignedButEligiblePercentage.toFixed(1)}%)</p>
                                            </div>
                                            <div className='col d-flex justify-content-between'>
                                                <p><span className='dark-dot'></span>{currentLanguage === 'english' ? 'Not eligible' : 'Nicht Taxonomiefähig'}</p>
                                                <p>{value.notEligibleValue} {value.showCurrency ? '€' : ''} ({notEligiblePercentage.toFixed(1)}%)</p>
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
                        <h3 className='fw-light'>{currentLanguage === 'english' ? 'Activities in Detail' : 'Detaillierte Auswertung der Aktivitäten'}</h3>
                    </div>
                    <div className="card-body text-start">
                        <p className="card-title">
                            <i>{currentLanguage === 'english' ? 'Disclaimer: The evaluation is based on the information provided in the tool. No verifications were conducted.' : 'Haftungsausschluss: Die Bewertung basiert auf den im Tool bereitgestellten Informationen. Es wurden keine Überprüfungen durchgeführt.'}</i>
                        </p>
                        <p>{currentLanguage === 'english' ? 'Legend' : 'Legende'}</p>
                        <div className='col'>
                            <p className="mt-3 d-flex align-items-center"><span className='darkgreen-dot'></span>{currentLanguage === 'english' ? 'Criteria met' : 'Kriterium erfüllt'}</p>
                            <p className="mt-3 d-flex align-items-center"><span className='orange-dot'></span>{currentLanguage === 'english' ? 'Criteria not met' : 'Kriterium nicht erfüllt'}</p>
                            <p className="mt-3 d-flex align-items-center"><span className='darkgrey-dot'></span>{currentLanguage === 'english' ? 'Criteria not assessable' : 'Kriterien nicht beurteilbar'}</p>
                        </div>
                    </div>
                </div>

                {<DashActivity currentLanguage={currentLanguage} DashResult={DashResult} alignedValue={alignedValue} notAlignedButEligibleValue={notAlignedButEligibleValue} NotEligible={NotEligible} />}

                {Dashopop && <DashboardPop setreloaddash={setreloaddash} setResults={setResults} totalTurnover={totalTurnover} totalCapex={totalCapex} totalOpex={totalOpex} TotalActivity={TotalActivity} setDashopop={setDashopop} users={users} />}

            </section>
        </div>
    );
}


export default Reports;




const DashboardPop = ({ setDashopop, users, setResults, setreloaddash }) => {
    const [turnover, setTurnover] = useState('');
    const [capex, setCapex] = useState('');
    const [opex, setOpex] = useState('');
    const [activity, setactivity] = useState('');
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
            setactivity(users.totalActivity);
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
            totalActivity: parseFloat(activity),
        };

        const messages = content[currentLanguage].errorMessages;
        let hasError = false;

        if (updatedData.totalTurnover < users.totalTurnover) {
            toast.error(messages.turnoverError.replace('{currentValue}', users.totalTurnover), {
                position: 'top-center',
                autoClose: 3000,
                theme: 'light',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
            hasError = true;
        }
        if (updatedData.totalCapex < users.totalCapex) {
            toast.error(messages.capexError.replace('{currentValue}', users.totalCapex), {
                position: 'top-center',
                autoClose: 3000,
                theme: 'light',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
            hasError = true;
        }
        if (updatedData.totalOpex < users.totalOpex) {
            toast.error(messages.opexError.replace('{currentValue}', users.totalOpex), {
                position: 'top-center',
                autoClose: 3000,
                theme: 'light',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
            hasError = true;
        }

        if (updatedData.totalActivity < users.totalActivity) {
            toast.error(messages.opexError.replace('{currentValue}', users.totalActivity), {
                position: 'top-center',
                autoClose: 3000,
                theme: 'light',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
            hasError = true;
        }

        if (hasError) {
            return; // Prevent form submission
        }

        try {
            const response = await fetch(`https://confess-data-tool-backend-beta.vercel.app/api/users/${users._id}/financial-data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setResults(updatedUser);
                setDashopop(false);
                setreloaddash(true)

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
            },
            errorMessages: {
                turnoverError: 'The entered turnover amount is lower than the current value of Total Turnover: {currentValue}.',
                capexError: 'The entered Capex amount is lower than the current value of Total Capex: {currentValue}.',
                opexError: 'The entered OpEx amount is lower than the current value of Total OpEx: {currentValue}.',
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
            },
            errorMessages: {
                turnoverError: 'Der eingegebene Umsatzbetrag liegt unter dem aktuellen Wert des Gesamtumsatzes: {currentValue}.',
                capexError: 'Der eingegebene CapEx-Betrag liegt unter dem aktuellen Wert des Gesamt-CapEx: {currentValue}.',
                opexError: 'Der eingegebene OpEx-Betrag liegt unter dem aktuellen Wert des Gesamt-OpEx: {currentValue}.',
            }
        }
    };

    const { heading, paragraphs, labels } = content[currentLanguage];
    const { errorMessages } = content[currentLanguage];

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
                        <div className={`input-wraps-dash ${activity ? 'has-values' : ''}`}>
                            <input
                                type='number'
                                className='input-totalact'
                                value={activity}
                                onChange={(e) => setactivity(parseFloat(e.target.value) || 0)}
                            />
                            <label>{labels.totalActivities} <span className='text-danger'>*</span></label>
                        </div>
                    </div>
                    <div className='Dash-submit-buttons'>
                        <button type="button" onClick={GoHome} className='btn btn-secondary'>{labels.cancel}</button>
                        <button type="submit" className='btn btn-primary'>{labels.submit}</button>
                    </div>
                </form>
                <ToastContainer />
            </section>
        </div>
    );
};



const DashActivity = ({ DashResult, currentLanguage, alignedValue, notAlignedButEligibleValue, NotEligible }) => {
    const [selectedFiscalYear, setSelectedFiscalYear] = useState('All');

    const handleFiscalYearChange = (event) => {
        setSelectedFiscalYear(event.target.value);
    };

    const getUniqueFiscalYears = () => {
        if (!Array.isArray(DashResult)) {
            return [];
        }

        const fiscalYears = DashResult.flatMap(value => {
            if (!Array.isArray(value?.answers)) {
                return [];
            }

            return value.answers
                .filter(answer => answer.questionType !== "Blank")
                .filter(answer => answer.questionCategory === 'Fiscal Year')
                .flatMap(answer => answer.answer || []);
        });

        return Array.from(new Set(fiscalYears));
    };

    const getFilteredDashResult = () => {
        if (selectedFiscalYear === 'All') {
            return DashResult;
        }

        if (!Array.isArray(DashResult)) {
            return [];
        }

        return DashResult.filter(value => {
            const filteredAnswers = Array.isArray(value?.answers) ? value.answers.filter(answer => answer.questionType !== "Blank") : [];
            const FiscalYear = filteredAnswers.filter(answer => answer.questionCategory === 'Fiscal Year');
            return FiscalYear.some(answer => answer.answer.includes(selectedFiscalYear));
        });
    };

    const updateValues = () => {
        alignedValue.length = 0;
        notAlignedButEligibleValue.length = 0;
        NotEligible.length = 0;

        const filteredResults = getFilteredDashResult();

        filteredResults.forEach((value, index) => {
            const filteredAnswers = Array.isArray(value?.answers) ? value.answers.filter(answer => answer.questionType !== "Blank") : [];
            const SubstentialContribution = filteredAnswers.filter(answer => answer.questionCategory === 'Substantial Contribution');
            const DNSHAdaption = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Adaptation');
            const DNSHce = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - CE');
            const DNSHwater = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Water');
            const DNSHpollution = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Pollution');
            const DNSHbiodiversity = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Biodiversity');
            const Turnover = filteredAnswers.filter(answer => answer.questionCategory === 'Turnover');
            const Capex = filteredAnswers.filter(answer => answer.questionCategory === 'CapEx');
            const OpEx = filteredAnswers.filter(answer => answer.questionCategory === 'OpEx');

            const AllSubstential = SubstentialContribution.length > 0 && SubstentialContribution.every(answer =>
                answer.answer.every(ans => ans.trim() !== "")
            );
            const AllDNSHAdaption = DNSHAdaption.length > 0 && DNSHAdaption.every(answer =>
                answer.answer.every(ans => ans.trim() !== "")
            );
            const AllDNSHce = DNSHce.length > 0 && DNSHce.every(answer =>
                answer.answer.every(ans => ans.trim() !== "")
            );
            const AllDNSHwater = DNSHwater.length > 0 && DNSHwater.every(answer =>
                answer.answer.every(ans => ans.trim() !== "")
            );
            const AllDNSHpollution = DNSHpollution.length > 0 && DNSHpollution.every(answer =>
                answer.answer.every(ans => ans.trim() !== "")
            );
            const AllDNSHbiodiversity = DNSHbiodiversity.length > 0 && DNSHbiodiversity.every(answer => 
                Array.isArray(answer.answer) && answer.answer.every(ans => {
                    const trimmedAns = ans.trim().toLowerCase();
                    return trimmedAns !== "no" && trimmedAns !== "nein";
                })
            );
            const AllTurnover = Turnover.length > 0 && Turnover.every(answer =>
                answer.answer.every(ans => ans.trim() !== "")
            );
            const AllCapex = Capex.length > 0 && Capex.every(answer =>
                answer.answer.every(ans => ans.trim() !== "")
            );
            const AllOpEx = OpEx.length > 0 && OpEx.every(answer =>
                answer.answer.every(ans => ans.trim() !== "")
            );

            const dotStatuses = [
                DNSHAdaption.length > 0 ? (AllDNSHAdaption ? 'darkgrey-dot' : 'orange-dot') : 'darkgrey-dot',
                DNSHwater.length > 0 ? (AllDNSHwater ? 'darkgreen-dot' : 'orange-dot') : 'darkgrey-dot',
                DNSHce.length > 0 ? (AllDNSHce ? 'darkgreen-dot' : 'orange-dot') : 'darkgrey-dot',
                DNSHpollution.length > 0 ? (AllDNSHpollution ? 'darkgreen-dot' : 'darkgreen-dot') : 'darkgrey-dot',
                DNSHbiodiversity.length > 0 ? (AllDNSHbiodiversity ? 'darkgreen-dot' : 'darkgreen-dot') : 'darkgrey-dot',
                Turnover.length > 0 ? (AllTurnover ? 'darkgreen-dot' : 'orange-dot') : 'darkgrey-dot',
                Capex.length > 0 ? (AllCapex ? 'darkgreen-dot' : 'orange-dot') : 'darkgrey-dot',
                OpEx.length > 0 ? (AllOpEx ? 'darkgreen-dot' : 'orange-dot') : 'darkgrey-dot',
            ];

            if (dotStatuses.every(status => status === 'darkgrey-dot')) {
                NotEligible.push(value);
            } else if (dotStatuses.includes('orange-dot')) {
                notAlignedButEligibleValue.push(value);
            } else if (!dotStatuses.includes('orange-dot')) {
                alignedValue.push(value);
            }
        });

        return filteredResults;
    };

    useEffect(() => {
        updateValues();
    }, [selectedFiscalYear]);

    return (
        <section>
            {updateValues().map((value, index) => {
                const filteredAnswers = Array.isArray(value?.answers) ? value.answers.filter(answer => answer.questionType !== "Blank") : [];
                const SubstentialContribution = filteredAnswers.filter(answer => answer.questionCategory === 'Substantial Contribution');
                const DNSHAdaption = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Adaptation');
                const DNSHce = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - CE');
                const DNSHwater = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Water');
                const DNSHpollution = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Pollution');
                const DNSHbiodiversity = filteredAnswers.filter(answer => answer.questionCategory === 'DNSH - Biodiversity');
                const Turnover = filteredAnswers.filter(answer => answer.questionCategory === 'Turnover');
                const Capex = filteredAnswers.filter(answer => answer.questionCategory === 'CapEx');
                const OpEx = filteredAnswers.filter(answer => answer.questionCategory === 'OpEx');

                const AllSubstential = SubstentialContribution.length > 0 && SubstentialContribution.every(answer =>
                    answer.answer.every(ans => ans.trim() !== "")
                );
                const AllDNSHAdaption = DNSHAdaption.length > 0 && DNSHAdaption.every(answer =>
                    answer.answer.every(ans => ans.trim() !== "")
                );
                const AllDNSHce = DNSHce.length > 0 && DNSHce.every(answer =>
                    answer.answer.every(ans => ans.trim() !== "")
                );
                const AllDNSHwater = DNSHwater.length > 0 && DNSHwater.every(answer =>
                    answer.answer.every(ans => ans.trim() !== "")
                );
                const AllDNSHpollution = DNSHpollution.length > 0 && DNSHpollution.every(answer =>
                    answer.answer.every(ans => ans.trim() !== "")
                );
                const AllDNSHbiodiversity = DNSHbiodiversity.length > 0 && DNSHbiodiversity.every(answer => 
                    Array.isArray(answer.answer) && answer.answer.every(ans => {
                        const trimmedAns = ans.trim().toLowerCase();
                        return trimmedAns !== "no" && trimmedAns !== "nein";
                    })
                );
                const AnyDNSH = DNSHAdaption.length > 0 || DNSHce.length > 0 || DNSHwater.length > 0 || DNSHpollution.length > 0 || DNSHbiodiversity.length > 0;

                const AllTurnover = Turnover.length > 0 && Turnover.every(answer =>
                    answer.answer.every(ans => ans.trim() !== "")
                );
                const AllCapex = Capex.length > 0 && Capex.every(answer =>
                    answer.answer.every(ans => ans.trim() !== "")
                );
                const AllOpEx = OpEx.length > 0 && OpEx.every(answer =>
                    answer.answer.every(ans => ans.trim() !== "")
                );
                // Adaptation is always grey because we cannot automatically check text answers
                const adaptationStatus = 'darkgrey-dot mx-4';
                const waterStatus = AnyDNSH ? (DNSHwater.length > 0 ? (AllDNSHwater ? 'darkgreen-dot mx-4' : 'orange-dot mx-4') : 'darkgreen-dot mx-4') : 'darkgrey-dot mx-4';
                const ceStatus = AnyDNSH ? (DNSHce.length > 0 ? (AllDNSHce ? 'darkgreen-dot mx-4' : 'orange-dot mx-4') : 'darkgreen-dot mx-4') : 'darkgrey-dot mx-4';
                const pollutionStatus = AnyDNSH ? (DNSHpollution.length > 0 ? (AllDNSHpollution ? 'darkgreen-dot mx-4' : 'orange-dot mx-4') : 'darkgreen-dot mx-4') : 'darkgrey-dot mx-4';
                const biodiversityStatus = AnyDNSH ? (DNSHbiodiversity.length > 0 ? (AllDNSHbiodiversity ? 'darkgreen-dot mx-4' : 'orange-dot mx-4') : 'darkgreen-dot mx-4') : 'darkgrey-dot mx-4';
                
                return (
                    <div key={value._id} className="card card-reports mt-5 text-start">
                        <div className="card-header">
                            <h3 className='fw-light'>
                                {currentLanguage === 'english' ? `Activity ${index + 1} - ${value.examName}` : `Aktivität ${index + 1} - ${value.examName}`}
                            </h3>
                        </div>
                        <div className='d-flex mx-3 mt-3 justify-content-between'>
                            <p>{currentLanguage === 'english' ? 'Substantial Contribution (Climate Change Mitigation)' : 'Substanzielle Beiträge (Klimaschutz)'}</p>
                            <span className={AllSubstential && AllOpEx && AllCapex & AllTurnover ? 'darkgreen-dot mx-4' : 'darkgrey-dot mx-4'}></span>
                        </div>
                        <p className="mx-3 mt-4">{currentLanguage === 'english' ? 'Do No Significant Harm' : 'Keine wesentlichen Schäden'}</p>
                        <div className='d-flex mx-3 mt-2 justify-content-between'>
                            <p>{currentLanguage === 'english' ? 'Climate Change Adaptation' : 'Klimawandel-Anpassung'}</p>
                            <span className={adaptationStatus}></span>
                        </div>
                        <div className='d-flex mx-3 justify-content-between'>
                            <p>{currentLanguage === 'english' ? 'Water and Marine Protection' : 'Wasser- und Meeresschutz'}</p>
                            <span className={waterStatus}></span>
                        </div>
                        <div className='d-flex mx-3 justify-content-between'>
                            <p>{currentLanguage === 'english' ? 'Circular Economy' : 'Kreislaufwirtschaft'}</p>
                            <span className={ceStatus}></span>
                        </div>
                        <div className='d-flex mx-3 justify-content-between'>
                            <p>{currentLanguage === 'english' ? 'Pollution Prevention' : 'Verschmutzungsprävention'}</p>
                            <span className={pollutionStatus}></span>
                        </div>
                        <div className='d-flex mx-3 justify-content-between'>
                            <p>{currentLanguage === 'english' ? 'Biodiversity' : 'Biodiversität'}</p>
                            <span className={biodiversityStatus}></span>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};














