import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoLight from "../../asset/logo_light.png";
import '../LandingPage.css';
import './Navbar.css';

const LanguageSelector = ({ changeLanguage, currentLanguage }) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {currentLanguage === 'english' ? 'Language' : 'Sprache'}
        </a>
        <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" onClick={() => changeLanguage('english')}>English</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => changeLanguage('german')}>German</a></li>
        </ul>
    </li>
);

const UserLinks = () => (
    <>
        <li className="nav-item">
            <a className="nav-link" href="/assessment">Assessments</a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="/results">Reports</a>
        </li>
    </>
);

const NavSection = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'english');
    const [loading, setLoading] = useState(true); // Add loading state

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/users`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    const fetchAdmins = useCallback(async () => {
        try {
            const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/admin`);
            if (response.ok) {
                const data = await response.json();
                setAdmins(data);
            } else {
                console.error('Failed to fetch admins');
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await fetchUsers();
            await fetchAdmins();
            setLoading(false); // Set loading to false after data is fetched
        };
        fetchData();
    }, [fetchUsers, fetchAdmins]);

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            const user = users.find(user => user.email === email);
            const admin = admins.find(admin => admin.email === email);
            if (user) {
                setCurrentUser({ ...user, role: 'user' });
            } else if (admin) {
                setCurrentUser({ ...admin, role: 'admin' });
            }
        } else {
            navigate('/login');
        }
    }, [users, admins, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        navigate('/login');
    };

    const changeLanguage = (language) => {
        if (currentLanguage !== language) {
            localStorage.setItem('language', language);
            setCurrentLanguage(language);
            window.location.reload(); // Force reload to apply language changes
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="/landing">
                        <img src={LogoLight} alt='logo' width={200} />
                    </a>
                    <button className="navbar-toggler btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Toggle menu */}
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">{currentLanguage === 'english' ? 'Confess-data-tool-Menu' : 'Confess-Daten-Tool-Menü'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item">
                                    <a className="dropdown-item" aria-current="page" href="/landing">{currentLanguage === 'english' ? 'Home' : 'Startseite'}</a>
                                </li>
                                <li className="nav-item">
                                    <a className="dropdown-item" href="/reports">{currentLanguage === 'english' ? 'Dashboard' : 'Armaturenbrett'}</a>
                                </li>
                                {!loading && currentUser?.role === 'admin' && <UserLinks />} {/* Show UserLinks only after loading */}
                                <LanguageSelector changeLanguage={changeLanguage} currentLanguage={currentLanguage} />
                                <li className="nav-item">
                                    <a className="dropdown-item logout-btn" onClick={handleLogout}>{currentLanguage === 'english' ? 'Logout' : 'Abmelden'}</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Normal menu */}
                    <div className="d-none d-lg-block">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/landing">{currentLanguage === 'english' ? 'Home' : 'Startseite'}</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/reports">{currentLanguage === 'english' ? 'Dashboard' : 'Armaturenbrett'}</a>
                            </li>
                            {!loading && currentUser?.role === 'admin' && <UserLinks />} {/* Show UserLinks only after loading */}
                            <LanguageSelector changeLanguage={changeLanguage} currentLanguage={currentLanguage} />
                            <li className="nav-item">
                                <a className="dropdown-item logout-btn" onClick={handleLogout}>{currentLanguage === 'english' ? 'Logout' : 'Abmelden'}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavSection;
