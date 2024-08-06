import React, { useState } from 'react';
import LogoLight from "../../asset/logo_light.png";
import './LoginAndSignup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const translations = {
    english: {
        username: "User Name",
        companyName: "Company Name",
        password: "Password",
        email: "Email Address",
        alreadyRegistered: "Already Registered? Go to login page.",
        signup: "Signup",
        failed: "Registration failed",
    },
    german: {
        username: "Benutzername",
        companyName: "Firmenname",
        password: "Passwort",
        email: "E-Mail Adresse",
        alreadyRegistered: "Bereits registriert? Gehen Sie zur Login-Seite.",
        signup: "Registrieren",
        failed: "Registrierung ist fehlgeschlagen",
    }
};

function SignupPage() {
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'english');
    const lang = translations[currentLanguage];

    const clearInput1 = () => setName('');
    const clearInput2 = () => setCompanyName('');
    const clearInput3 = () => setEmail('');
    const clearInput4 = () => setPassword('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('https://confess-data-tool-backend-beta.vercel.app/api/users/register', {
                name,
                companyName,
                email,
                password
            });
            setSuccess(response.data);
            setName('');
            setCompanyName('');
            setEmail('');
            setPassword('');
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            setError(error.response ? error.response.data : lang.failed);
        }
    };

    const GotoLoginPage = () => {
        navigate('/login');
    };

    return (
        <div className='loginandsignup-main'>
            <div className='d-flex justify-content-center align-items-center flex-column gap-4'>
                <img src={LogoLight} alt='logo' width={300} />
                <section className='loginandsignup'>
                    <form onSubmit={handleSubmit}>
                        {error && <p className='error-message'>{error}</p>}
                        {success && <p className='success-message'>{success}</p>}
                        <div className={`input-wrap ${name ? 'has-value' : ''}`}>
                            <input
                                type='text'
                                className='login-input1'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label>{lang.username}</label>
                            {name && <button type="button" className="clear-button" onClick={clearInput1}>
                                <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                            </button>}
                        </div>
                        <div className={`input-wrap ${companyName ? 'has-value' : ''}`}>
                            <input
                                type='text'
                                className='login-input2'
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                            <label>{lang.companyName}</label>
                            {companyName && <button type="button" className="clear-button" onClick={clearInput2}>
                                <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                            </button>}
                        </div>
                        <div className={`input-wrap ${email ? 'has-value' : ''}`}>
                            <input
                                type='email'
                                className='login-input3'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>{lang.email}</label>
                            {email && <button type="button" className="clear-button" onClick={clearInput3}>
                                <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                            </button>}
                        </div>
                        <div className={`input-wrap ${password ? 'has-value' : ''}`}>
                            <input
                                type='password'
                                className='login-input4'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label>{lang.password}</label>
                            {password && <button type="button" className="clear-button" onClick={clearInput4}>
                                <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                            </button>}
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type='submit' className='btn-signup'>{lang.signup}</button>
                        </div>
                        <p className='fw-light' style={{ cursor: 'pointer' }} onClick={GotoLoginPage}>{lang.alreadyRegistered}</p>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default SignupPage;
