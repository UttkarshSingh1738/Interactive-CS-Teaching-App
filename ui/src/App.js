import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chatroom from "./components/Chatroom";
import MyMessages from "./components/MyMessages";
import Quiz from "./components/Quiz";
import Leaderboard from "./components/Leaderboard";
import Stats from "./components/Stats";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path='/' element={<Login/>} />
                    <Route path='/register' element={<Register/>} />
                    {/* After login, user lands on the Quiz page */}
                    <Route path="/quiz" element={<Quiz/>} />
                    <Route path="/chatroom" element={<Chatroom/>} />
                    <Route path="/userMessages" element={<MyMessages/>} />
                    <Route path="/leaderboard" element={<Leaderboard/>} />
                    <Route path="/stats" element={<Stats/>} />
                </Routes>
                <div className="footer">
                    &copy; 2024 Tutoring Application | All rights reserved
                </div>
            </div>
        </Router>
    );
}

export default App;
