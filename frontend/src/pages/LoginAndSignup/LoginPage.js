import React, { useState } from 'react';
import LogoLight from "../../asset/logo_light.png";
import './LoginAndSignup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const translations = {
    english: {
        loginError: "Login failed",
        notRegistered: "Not Registered? Go to signup page",
        password: "Password",
        email: "Email Address",
        login: "Login",
    },
    german: {
        loginError: "Login ist fehlgeschlagen",
        notRegistered: "Nicht registriert? Zur Anmeldeseite gehen",
        password: "Passwort",
        email: "E-Mail Adresse",
        login: "Login",
    }
};

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'english');
    const lang = translations[currentLanguage];

    const clearInput2 = () => setEmail('');
    const clearInput3 = () => setPassword('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('https://confess-data-tool-backend-beta.vercel.app/api/users/login', {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email);
            navigate('/landing');
        } catch (error) {
            setError(error.response ? error.response.data : lang.loginError);
        }
    };


    const GotoSignupPage = () => {
        navigate('/signup');
    };

    return (
        <div className='loginandsignup-main'>
            <div className='d-flex justify-content-center align-items-center flex-column gap-4'>
                <img src={LogoLight} alt='logo' width={300} />
                <section className='loginandsignup'>
                    <form onSubmit={handleSubmit}>
                        {error && <p className='error-message'>{error}</p>}
                        <div className={`input-wrap ${email ? 'has-value' : ''}`}>
                            <input
                                type='email'
                                className='login-input2'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>{lang.email}</label>
                            {email && <button type="button" className="clear-button" onClick={clearInput2}>
                                <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                            </button>}
                        </div>
                        <div className={`input-wrap ${password ? 'has-value' : ''}`}>
                            <input
                                type='password'
                                className='login-input3'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label>{lang.password}</label>
                            {password && <button type="button" className="clear-button" onClick={clearInput3}>
                                <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                            </button>}
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type='submit' className='btn-signup'>{lang.login}</button>
                        </div>
                        <p className='fw-light' style={{ cursor: 'pointer' }} onClick={GotoSignupPage}>{lang.notRegistered}</p>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default LoginPage;
