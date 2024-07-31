import React, { useEffect, useState } from 'react';
import LogoLight from "../../asset/logo_light.png";
import './ProfileSettings.css';

function ProfileSettings() {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const storedEmail = localStorage.getItem('email');
            setEmail(storedEmail);
            try {
                const response = await fetch(`https://confess-data-tool-backend-beta.vercel.app/api/users`);
                if (response.ok) {
                    const data = await response.json();
                    const matchedUser = data.find(user => user.email === storedEmail);
                    if (matchedUser) {
                        setUsers([matchedUser]);
                        setUserName(matchedUser.name);
                        setCompanyName(matchedUser.companyName);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const user = {
            name: userName,
            companyName: companyName,
            email: email
        };
        try {
            const response = await fetch(`https://confess-data-tool-backend-beta.vercel.app/api/users/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                const updatedUser = await response.json();
                setUsers([updatedUser]);
                setSuccess(true);
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    useEffect(() => {
        if (success) {
            alert('Updated successfully');
            setSuccess(false); // Reset success state
        }
    }, [success]);

    return (
        <section className='mt-5'>
            {users.map((value, index) => (
                <div key={index}>
                    <div className="container">
                        <img src={LogoLight} alt='logo' width={300} />
                        <h1 className="text-secondary mt-5">Edit Profile</h1>
                        <hr />
                        <div className="row">
                            <div className="personal-info my-5">
                                <h3>Personal info</h3>
                                <form className="form-horizontal text-start" role="form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="col-lg-3 control-label">User Name:</label>
                                        <div className="col-lg-8 mt-2">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label className="col-lg-3 control-label">Company Name:</label>
                                        <div className="col-lg-8 mt-2">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label className="col-lg-3 control-label">Email:</label>
                                        <div className="col-lg-8 mt-2">
                                            <input className="form-control" disabled type="text" value={email} />
                                        </div>
                                    </div>
                                    <div className="form-group mt-5">
                                        <div className="col mt-2">
                                            <input className="form-control bg-primary text-white" type="submit" value="Submit" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <hr />
                    </div>
                </div>
            ))}
        </section>
    );
}

export default ProfileSettings;
