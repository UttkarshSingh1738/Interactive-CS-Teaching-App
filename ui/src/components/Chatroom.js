import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import {useNavigate} from "react-router-dom";

const gradients = [                                                                     
    'linear-gradient(135deg, #682a00, #7d63e6)',
    'linear-gradient(135deg, #7d63e6, #00ff7f)',
    'linear-gradient(135deg, #00ff7f, #ff4500)',
    'linear-gradient(135deg, #ff4500, #1e90ff)',
    'linear-gradient(135deg, #1e90ff, #682a00)'
];

function Chatroom() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('')
    const [gradientIndex, setGradientIndex] = useState(0);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    useEffect(() => {

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.sub);
            } catch (err) {
                console.error('Invalid token specified:', err);
                sessionStorage.removeItem('token');
                navigate('/');
                return;
            }
        } else {
            navigate('/');
            return;
        }

        const fetchMessages = async () => {
            try {
                const response = await axios.get('/api/chatroom', {
                    headers: {'Authorization': `Bearer ${token}` }});
                setMessages(response.data);
            } catch (err) {
                console.error('Error fetching messages:', err);
            }
        };
        fetchMessages();
    }, [navigate, token]);

    const sendMessage = async () => {
        if (newMessage.trim() !== '') {
            try {
                await axios.post('/api/chatroom/send', { message: newMessage }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setNewMessage('');
                const response = await axios.get('/api/chatroom', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const editMessage = async (messageId, currentMessage) => {
        const newMessage = prompt("Edit your message:", currentMessage);
        if (newMessage) {
            try {
                await axios.post('/api/chatroom/update', { message: newMessage, id: messageId }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Fetch messages again to update the list
                const response = await axios.get('/api/chatroom', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error editing message:', error);
            }
        }
    };

    const deleteMessage = async (messageId) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await axios.post('/api/chatroom/delete', {id: messageId}, { headers: {
                        'Authorization': `Bearer ${token}`
                    }});
                // Fetch messages again to update the list
                const response = await axios.get('/api/chatroom', {headers: {
                        'Authorization': `Bearer ${token}`
                    }});
                setMessages(response.data);
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/');
    };

    const getUsernameColor = (username) => {
        const hash = hashCode(username);
        const hue = Math.abs(hash % 360); // Ensure hue is non-negative
        const lightness = 50 + Math.abs(hash % 20); // Vary lightness slightly
        return `hsl(${hue}, 70%, ${lightness}%)`;
    };

    const hashCode = (str) => {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
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
            <div className="text-center mb-4">
                <h1 className="welcome-message-1">Welcome to the Chatroom, {username}!</h1>
            </div>
            <div className="col-md-12 animated-div">
                <div className="card-body chat-box" style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {messages.map((message) => (
                        <div className="chat-message mb-3" key={message.id}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong
                                        style={{color: getUsernameColor(message.user.username)}}>{message.user.username}</strong>: <span
                                    className="message-text">{message.message}</span>
                                </div>
                                <small className="text-muted">{new Date(message.updatedTime).toLocaleString()}</small>
                            </div>
                            {message.user.username === username && (
                                <div className="chat-message">
                                    <div>
                                        {message.content}
                                    </div>
                                    {message.user.username === username && (
                                        <div className="actions position-absolute" style={{right: 0}}>
                                            <button className="btn btn-sm btn-warning me-2"
                                                    onClick={() => editMessage(message.id, message.message)}>Edit
                                            </button>
                                            <button className="btn btn-sm btn-danger"
                                                    onClick={() => deleteMessage(message.id)}>Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="input-group my-4 animated-div">
                <input
                    type="text"
                    className="form-control"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button className="btn btn-primary" onClick={sendMessage}>Send</button>
            </div>
            <div className="text-center mt-4 animated-div">
                <button className="btn btn-info me-2" onClick={() => navigate('/quiz')}>Go to Quiz</button>
                <button className="btn btn-info me-2" onClick={() => navigate('/userMessages')}>View My Messages</button>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Chatroom;