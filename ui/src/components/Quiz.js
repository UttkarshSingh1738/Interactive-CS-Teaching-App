// File: src/components/Quiz.js
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

function Quiz() {
    const [quizQuestion, setQuizQuestion] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [username, setUsername] = useState("");
    const [gradientIndex, setGradientIndex] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [quizType, setQuizType] = useState("");
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
        fetchQuestion();
    }, [token, navigate]);

    const fetchQuestion = async () => {
        try {
            const response = await axios.get("/quiz/question", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Assuming response.data contains: { quizType, questionText, correctAnswer }
            setQuizQuestion(response.data.questionText);
            setCorrectAnswer(response.data.correctAnswer);
            setQuizType(response.data.quizType);
            setFeedback("");
            setStartTime(Date.now());
        } catch (error) {
            console.error("Error fetching quiz question:", error);
        }
    };    

    const submitAnswer = async () => {
        const endTime = Date.now();
        const duration = Math.floor((endTime - startTime) / 1000); // in seconds
        try {
            const data = {
                quizType: quizType,  // use the quiz type from the fetched question
                question: quizQuestion,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                duration: duration
            };
            const response = await axios.post("/quiz/attempt", data, { 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }                
            });
            if (response.data.isCorrect) {
                setFeedback("Correct!");
            } else {
                setFeedback("Incorrect. Try again.");
            }
            setUserAnswer("");
            fetchQuestion();
        } catch (error) {
            console.error("Error submitting answer:", error);
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
                    <h3 className="mb-0">Quiz Page</h3>
                </div>
                <div className="card-body">
                    <p className="lead">Welcome, {username}!</p>
                    <div className="mb-3">
                        <h5>Question:</h5>
                        <p>{quizQuestion}</p>
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Your answer"
                        />
                    </div>
                    <button className="btn btn-success" onClick={submitAnswer}>
                        Submit Answer
                    </button>
                    {feedback && <div className="mt-3 alert alert-info">{feedback}</div>}
                </div>
                <div className="card-footer text-center">
                    <button className="btn btn-secondary me-2" onClick={() => navigate("/chatroom")}>Chatroom</button>
                    <button className="btn btn-secondary me-2" onClick={() => navigate("/leaderboard")}>Leaderboard</button>
                    <button className="btn btn-secondary" onClick={() => navigate("/stats")}>Stats</button>
                </div>
            </div>
        </div></div>
    );
}

export default Quiz;
