import React, { useEffect, useState } from 'react';
import './Reports.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

function Reports() {
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);
    const [totalTurnover, setTotalTurnover] = useState(0);
    const [totalCapex, setTotalCapex] = useState(0);
    const [totalOpex, setTotalOpex] = useState(0);
    const navigate = useNavigate();
    const [Dashopop, setDashopop] = useState(true)

    useEffect(() => {
        const email = localStorage.getItem('email');

        if (email) {
            fetch(`https://confess-data-tool-backend.vercel.app/api/dashboard?email=${email}`)
                .then(response => response.json())
                .then(data => {
                    setUsers(data.users);
                    setResults(data.results);
                    let turnover = 0;
                    let capex = 0;
                    let opex = 0;
                    data.results.forEach(result => {
                        result.answers.forEach(answer => {
                            if (answer.questionCategory === 'Turnover') {
                                turnover += parseFloat(answer.answer[0]) || 0;
                            } else if (answer.questionCategory === 'CapEx') {
                                capex += parseFloat(answer.answer[0]) || 0;
                            } else if (answer.questionCategory === 'OpEx') {
                                opex += parseFloat(answer.answer[0]) || 0;
                            }
                        });
                    });
                    setTotalTurnover(turnover);
                    setTotalCapex(capex);
                    setTotalOpex(opex);

                    // Check if all filtered answers have non-empty values
                    const hasUnansweredQuestions = data.results.some(result => {
                        const filteredAnswers = result.answers.filter(answer => answer.questionType !== "Blank");
                        return !filteredAnswers.every(answer => answer.answer.some(ans => ans.trim() !== ''));
                    });

                    if (hasUnansweredQuestions) {
                        // alert("Not all answered");
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, []);

    const ChartDetails = [
        {
            title: "Turnover",
            topic: "EU Taxonomy alignment for Clean Energy Activities",
            alignedValue: 0,
            notAlignedButEligibleValue: totalTurnover,
            notEligibleValue: 0
        },
        {
            title: "CapEx",
            topic: "EU Taxonomy alignment for Clean Energy Activities",
            alignedValue: 0,
            notAlignedButEligibleValue: totalCapex,
            notEligibleValue: 0
        },
        {
            title: "OpEx",
            topic: "EU Taxonomy alignment for Clean Energy Activities",
            alignedValue: 0,
            notAlignedButEligibleValue: totalOpex,
            notEligibleValue: 0
        },
        {
            title: "# of Activities",
            topic: "EU Taxonomy alignment for Clean Energy Activities",
            alignedValue: 0,
            notAlignedButEligibleValue: results.length,
            notEligibleValue: 0
        }
    ];

    const TotalActivity = results.length

    return (
        <div className='d-flex justify-content-center mt-5'>
            <section className='reports-main'>
                <div className="card card-reports">
                    <div className="card-header text-start">
                        <h3 className='fw-light'>Report: CONFESS</h3>
                        {users.map((val, index) => {
                            const capitalizeName = (name) => {
                                return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                            };
                            return <p key={index}>For {capitalizeName(val.companyName)}</p>;
                        })}
                    </div>
                    <div className="card-body text-start">
                        <p className="card-title">
                            <i>Disclaimer: The evaluation is based on the information provided in the tool. No verifications were conducted.</i>
                        </p>
                        <p className="card-title mt-3">Total Number of Activities: <span>{results.length}</span></p>
                        <p className="mt-3">Total Turnover: {totalTurnover} $ <br />Total CapEx: {totalCapex} $ <br /> Total OpEx: {totalOpex} $</p>
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
                                                    // background: `conic-gradient(#394D2C 0% ${alignedPercentage}%, #C4C4C4 ${alignedPercentage}% ${alignedPercentage + notAlignedButEligiblePercentage}%, #6CC784 ${alignedPercentage + notAlignedButEligiblePercentage}% 100%)`
                                                }}>
                                                {/* <span className="percentage-label">{alignedPercentage.toFixed(1)}%</span> */}
                                            </div>
                                        </div>
                                        <div className='row d-flex flex-column justify-content-between align-items-center'>
                                            <div className='col d-flex justify-content-between'>
                                                <p>Aligned</p>
                                                <p>{value.alignedValue} $ ({alignedPercentage.toFixed(1)}%)</p>
                                            </div>
                                            <div className='col d-flex justify-content-between'>
                                                <p>Not aligned but eligible</p>
                                                <p>{value.notAlignedButEligibleValue} $ ({notAlignedButEligiblePercentage.toFixed(1)}%)</p>
                                            </div>
                                            <div className='col d-flex justify-content-between'>
                                                <p>Not eligible</p>
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
                        <h3 className='fw-light'>Activities in Detail</h3>
                    </div>
                    <div className="card-body text-start">
                        <p className="card-title">
                            <i>Disclaimer: The evaluation is based on the information provided in the tool. No verifications were conducted.</i>
                        </p>
                        <p>Legend</p>
                        <div className='col'>
                            <p className="mt-3 d-flex align-items-center"><span className='darkgreen-dot'></span>Criteria met</p>
                            <p className="mt-3 d-flex align-items-center"><span className='orage-dot'></span>Criteria not met</p>
                            <p className="mt-3 d-flex align-items-center"><span className='darkgrey-dot'></span>Criteria not assessable</p>
                        </div>
                    </div>
                </div>


                <section>
                    {results.map((value, index) => {
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

                        console.log(AllSubstential);
                        return (
                            <div key={value._id} className="card card-reports mt-5 text-start">
                                <div className="card-header">
                                    <h3 className='fw-light'>{value.examCategory} Activity {index + 1} - {value.examName}</h3>
                                </div>

                                <div className='d-flex mx-3 mt-3 justify-content-between'>
                                    <p>Substantial Contribution (Climate Change Mitigation)</p>
                                    <span className={AllSubstential ? 'darkgreen-dot mx-4' : 'orage-dot mx-4'}></span>
                                </div>
                                <p className="mx-3 mt-4">Do No Significant Harm</p>
                                <div className='d-flex mx-3 mt-2 justify-content-between'>
                                    <p>Climate Change Adaptation</p>
                                    <span className={AllDNSHAdaption ? 'darkgrey-dot mx-4' : 'darkgrey-dot mx-4'}></span>
                                </div>
                                <div className='d-flex mx-3 justify-content-between'>
                                    <p>Water and Marine Protection</p>
                                    <span className={AllDNSHwater ? 'darkgreen-dot mx-4' : 'orage-dot mx-4'}></span>
                                </div>
                                <div className='d-flex mx-3 justify-content-between'>
                                    <p>Circular Economy</p>
                                    <span className={AllDNSHce ? 'darkgreen-dot mx-4' : 'orage-dot mx-4'}></span>
                                </div>
                                <div className='d-flex mx-3 justify-content-between'>
                                    <p>Pollution Prevention</p>
                                    <span className={AllDNSHpollution ? 'darkgreen-dot mx-4' : 'orage-dot mx-4'}></span>
                                </div>
                                <div className='d-flex mx-3 justify-content-between'>
                                    <p>Biodiversity</p>
                                    <span className={AllDNSHbiodibersity ? 'darkgreen-dot mx-4' : 'orage-dot mx-4'}></span>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {Dashopop && <DashboardPop totalTurnover={totalTurnover} totalCapex={totalCapex} totalOpex={totalOpex} TotalActivity={TotalActivity} setDashopop={setDashopop} />}
            </section>

        </div >
    );
}

export default Reports;


const DashboardPop = ({ totalTurnover, totalCapex, totalOpex, TotalActivity, setDashopop }) => {

    const [turnover, setTurnover] = useState()
    const [capex, setCapex] = useState()
    const [opex, setOpex] = useState()
    const [totalact, setTotalact] = useState()

    const closeThePop = () => {
        setDashopop(false)
    }


    return <div className='Dash-pop'>

        <section >
            <h4>Update Total Turnover, CapEx, OpEx</h4>
            <p>Reporting in accordance with the EU taxonomy indicates the proportion of taxonomy eligible and taxonomy aligned economic activities.</p>
            <p>In order to determine their monetary value, the share of taxonomy eligible and taxonomy-aligned activities in turnover, CapEx and OpEx is calculated and reported.
                To calculate this, we need to know your total turnover, CapEx and OpEx of the last fiscal year.
                We also need to know the total number of economic activities your company performs.</p>
            <p>If you do not know and cannot collect the exact total financials of the last year, please estimate:</p>

            <form>
                <div>
                    <div className={`input-wraps-dash ${turnover ? 'has-values' : ''}`}>
                        <input type='number' className='input-turnover' value={totalTurnover} onChange={(e) => setTurnover(e.target.value)} />
                        <label>Total Turnover <span className='text-danger'>*</span></label>

                        <FontAwesomeIcon
                            icon={faEuroSign}
                            className='euro-signs'
                        />
                    </div>
                    <div className={`input-wraps-dash ${capex ? 'has-values' : ''}`}>
                        <input type='number' className='input-capex' value={totalCapex} onChange={(e) => setCapex(e.target.value)} />
                        <label>Total Capex <span className='text-danger'>*</span></label>

                        <FontAwesomeIcon
                            icon={faEuroSign}
                            className='euro-signs'
                        />
                    </div>
                    <div className={`input-wraps-dash ${opex ? 'has-values' : ''}`}>
                        <input type='number' className='input-opex' value={totalOpex} onChange={(e) => setOpex(e.target.value)} />
                        <label>Total OpEx<span className='text-danger'>*</span></label>

                        <FontAwesomeIcon
                            icon={faEuroSign}
                            className='euro-signs'
                        />
                    </div>
                    <div className={`input-wraps-dash ${totalact ? 'has-values' : ''}`}>
                        <input type='number' className='input-totalact' value={TotalActivity} onChange={(e) => setTotalact(e.target.value)} />
                        <label>Total Activities<span className='text-danger'>*</span></label>

                        <FontAwesomeIcon
                            icon={faEuroSign}
                            className='euro-signs'
                        />
                    </div>



                </div>
                <div className='Dash-submit-buttons'>
                    <button onClick={closeThePop} className='btn btn-secondary'>Cancel</button>
                    <button onClick={closeThePop} className='btn btn-primary'>Submit</button>
                </div>

            </form>

        </section>





    </div>
}
