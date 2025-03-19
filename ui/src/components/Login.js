import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const gradients = [
    'linear-gradient(135deg, #00ff7f, #ff4500)',
    'linear-gradient(135deg, #7d63e6, #00ff7f)',
    'linear-gradient(135deg, #682a00, #7d63e6)',
    'linear-gradient(135deg, #ff4500, #1e90ff)',
    'linear-gradient(135deg, #1e90ff, #682a00)'
];

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [gradientIndex, setGradientIndex] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/authenticate', { username, password });
            if (response.data.status === 'success') {
                sessionStorage.setItem('token', response.data.token);
                navigate('/quiz');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Error during authentication');
        }
    };

    const changeGradient = () => {
        const newIndex = (gradientIndex + 1) % gradients.length;
        setGradientIndex(newIndex);
    };

    return (
        <div
            className="bg-container"
            style={{ background: gradients[gradientIndex] }}
            onClick={changeGradient}
        >
            <div className="welcome-message-1">Welcome to the Interactive CS Teaching App!</div>
            <div className="description">
                This application is designed to help you learn and practice key computer science concepts.
                Challenge yourself with engaging quizzes on topics such as binary arithmetic and logic gates,
                track your progress with detailed performance statistics, and join a lively multiuser chatroom
                to discuss ideas and strategies. Whether you're reviewing fundamentals or diving into new material,
                this app makes learning interactive and fun!
            </div>
            <div className="row justify-content-center mt-5">
                <div className="col-md-12 animated-div">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Login</h2>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
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
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-4">Login</button>
                            </form>
                            <p className="text-center mt-3">Don't have an account?{" "}
                                <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/register')}>Register here</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
