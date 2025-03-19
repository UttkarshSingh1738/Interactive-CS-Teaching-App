// File: src/components/Leaderboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const gradients = [                                                                     
    'linear-gradient(135deg, #682a00, #7d63e6)',
    'linear-gradient(135deg, #7d63e6, #00ff7f)',
    'linear-gradient(135deg, #00ff7f, #ff4500)',
    'linear-gradient(135deg, #ff4500, #1e90ff)',
    'linear-gradient(135deg, #1e90ff, #682a00)'
];

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [username, setUsername] = useState("");
    const [gradientIndex, setGradientIndex] = useState(0);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.sub);
            } catch (err) {
                console.error("Invalid token:", err);
                sessionStorage.removeItem("token");
                navigate("/");
            }
        } else {
            navigate("/");
        }
        fetchLeaderboard();
    }, [token, navigate]);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get("/quiz/leaderboard", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLeaderboard(response.data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
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
        onClick={changeGradient}  // This will update the gradient on every click
        >
        <div className="container mt-5">
            <div className="card mx-auto" style={{ maxWidth: "600px" }}>
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Leaderboard</h3>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.username}</td>
                                    <td>{entry.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer text-center">
                    <button className="btn btn-secondary me-2" onClick={() => navigate("/quiz")}>Quiz</button>
                    <button className="btn btn-secondary me-2" onClick={() => navigate("/chatroom")}>Chatroom</button>
                    <button className="btn btn-secondary" onClick={() => navigate("/stats")}>Stats</button>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Leaderboard;
