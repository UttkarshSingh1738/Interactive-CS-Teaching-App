// File: src/components/Stats.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const gradients = [                                                                     
    'linear-gradient(135deg, #682a00, #7d63e6)',
    'linear-gradient(135deg, #7d63e6, #00ff7f)',
    'linear-gradient(135deg, #00ff7f, #ff4500)',
    'linear-gradient(135deg, #ff4500, #1e90ff)',
    'linear-gradient(135deg, #1e90ff, #682a00)'
];

function Stats() {
    const [stats, setStats] = useState(null);
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
        fetchStats();
    }, [token, navigate]);

    const fetchStats = async () => {
        try {
            const response = await axios.get("/quiz/stats", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const changeGradient = () => {
        const newIndex = (gradientIndex + 1) % gradients.length;
        setGradientIndex(newIndex);
    };

    // Prepare timeline chart data if available.
    let timelineChartData = null;
    if (stats && stats.timeline) {
        timelineChartData = {
            labels: stats.timeline.map(item => item.date),
            datasets: [
                {
                    label: 'Attempts',
                    data: stats.timeline.map(item => item.attempts),
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    fill: false,
                },
                {
                    label: 'Correct',
                    data: stats.timeline.map(item => item.correct),
                    borderColor: 'rgba(153,102,255,1)',
                    backgroundColor: 'rgba(153,102,255,0.2)',
                    fill: false,
                }
            ]
        };
    }

    return (
        <div
            className="bg-container"
            style={{ background: gradients[gradientIndex] }}
            onClick={changeGradient}
        >
            <div className="container mt-5">
                <div className="card mx-auto" style={{ maxWidth: "600px" }}>
                    <div className="card-header bg-primary text-white">
                        <h3 className="mb-0">Your Quiz Stats</h3>
                    </div>
                    <div className="card-body">
                        {stats ? (
                            <div>
                                {/* Side by side layout for overall stats */}
                                <div className="row">
                                    <div className="col-6">
                                        <p><strong>Total Attempts:</strong> {stats.totalAttempts}</p>
                                    </div>
                                    <div className="col-6">
                                        <p><strong>Correct Attempts:</strong> {stats.correctAttempts}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p>
                                            <strong>Average Duration:</strong> {parseFloat(stats.averageDuration).toFixed(2)} seconds
                                        </p>
                                    </div>
                                    <div className="col-6">
                                        <p>
                                            <strong>Overall Accuracy:</strong> {parseFloat(stats.accuracyPercentage).toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                                <hr />
                                <h5>Breakdown by Quiz Type:</h5>
                                {stats.breakdownByType && Object.keys(stats.breakdownByType).map(type => (
                                    <div key={type}>
                                        <p>
                                            <strong>{type}</strong>: {stats.breakdownByType[type].attempts} attempts, {stats.breakdownByType[type].correct} correct, {parseFloat(stats.breakdownByType[type].accuracy).toFixed(2)}% accuracy
                                        </p>
                                    </div>
                                ))}
                                <hr />
                                <h5>Timeline (Attempts per Day):</h5>
                                {timelineChartData ? (
                                    <Line
                                        data={timelineChartData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { position: 'top' },
                                                title: { display: true, text: 'Quiz Attempts Over Time' }
                                            }
                                        }}
                                    />
                                ) : (
                                    <p>No timeline data available.</p>
                                )}
                            </div>
                        ) : (
                            <p>Loading stats...</p>
                        )}
                    </div>
                    <div className="card-footer text-center">
                        <button className="btn btn-secondary me-2" onClick={() => navigate("/quiz")}>Quiz</button>
                        <button className="btn btn-secondary me-2" onClick={() => navigate("/chatroom")}>Chatroom</button>
                        <button className="btn btn-secondary" onClick={() => navigate("/leaderboard")}>Leaderboard</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;
