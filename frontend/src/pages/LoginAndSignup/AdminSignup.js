import React, { useState } from 'react';
import LogoLight from "../../asset/logo_light.png";
import './LoginAndSignup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminSignup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const clearInput1 = () => setName('');
    const clearInput2 = () => setEmail('');
    const clearInput3 = () => setPassword('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('https://confess-data-tool-backend.vercel.app/api/admin/register', {
                name,
                email,
                password
            });
            setSuccess(response.data);
            setName('');
            setEmail('');
            setPassword('');
            navigate('/admin'); // Redirect to login page after successful registration
        } catch (error) {
            setError(error.response ? error.response.data : 'Registration failed');
        }
    };

    const GotoLoginPage = () => {
        navigate('/admin');
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
                            <label>User Name</label>
                            {name && <button type="button" className="clear-button" onClick={clearInput1}>
                                <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                            </button>}
                        </div>
                        <div className={`input-wrap ${email ? 'has-value' : ''}`}>
                            <input
                                type='email'
                                className='login-input2'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Email Address</label>
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
                            <label>Password</label>
                            {password && <button type="button" className="clear-button" onClick={clearInput3}>
                                <FontAwesomeIcon className='input-close-icon' icon={faCircleXmark} />
                            </button>}
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type='submit' className='btn-signup'>Signup</button>
                        </div>
                        <p className='fw-light' style={{ cursor: 'pointer' }} onClick={GotoLoginPage}>Already Registered? Go to login page.</p>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default AdminSignup
