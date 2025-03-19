import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const gradients = [
    'linear-gradient(135deg, #7d63e6, #00ff7f)',
    'linear-gradient(135deg, #682a00, #7d63e6)',
    'linear-gradient(135deg, #00ff7f, #ff4500)',
    'linear-gradient(135deg, #ff4500, #1e90ff)',
    'linear-gradient(135deg, #1e90ff, #682a00)'
];

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [gradientIndex, setGradientIndex] = useState(0);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validatePassword(password)) {
            setMessage('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        setPasswordError('');
        try {
            await axios.post('/api/save', { username, password });
            setMessage('Registration successful! Redirecting to login page...');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            setError('Error registering. Please try again.');
            console.error('Error registering:', error);
        }
    };

    const changeGradient = () => {
        const newIndex = (gradientIndex + 1) % gradients.length;
        setGradientIndex(newIndex);
    };

    return (
        <div
            className="bg-container"
            style={{background: gradients[gradientIndex]}}
            onClick={changeGradient}
        >
            <div className="row justify-content-center mt-5">
                <div className="col-md-12 animated-div">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Register</h2>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            {message && <div
                                className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} text-center`}>{message}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="username"></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password"></label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    {passwordError && <div className="text-danger mt-2">{passwordError}</div>}
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-4">Register</button>
                            </form>
                            <p className="text-center mt-3">Already have an account?{" "}
                                <span style={{color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}
                                      onClick={() => navigate('/')}>Login here</span>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
