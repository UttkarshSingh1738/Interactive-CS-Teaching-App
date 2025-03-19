import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const gradients = [
    'linear-gradient(135deg, #1e90ff, #682a00)',
    'linear-gradient(135deg, #7d63e6, #00ff7f)',
    'linear-gradient(135deg, #00ff7f, #ff4500)',
    'linear-gradient(135deg, #ff4500, #1e90ff)',
    'linear-gradient(135deg, #682a00, #7d63e6)'
];

function UserMessages() {
    const [messages, setMessages] = useState([]);
    const token = sessionStorage.getItem('token');
    const [username, setUsername] = useState('');
    const [gradientIndex, setGradientIndex] = useState(0);
    const navigate = useNavigate();

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

        const fetchUserMessages = async () => {
            try {
                const response = await axios.post('/api/chatroom/userMessages', { username: username }, {headers: {
                        'Authorization': `Bearer ${token}`
                    }});
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching user messages:', error);
            }
        };
        fetchUserMessages();
    }, [navigate, token, username]);

    const editMessage = async (messageId, currentMessage) => {
        const newMessage = prompt("Edit your message:", currentMessage);
        if (newMessage) {
            try {
                await axios.post('/api/chatroom/update', { message: newMessage, id: messageId }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const response = await axios.post('/api/chatroom/userMessages', { username: username }, {headers: {
                        'Authorization': `Bearer ${token}`
                    }});
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
                const response = await axios.post('/api/chatroom/userMessages', { username: username }, {headers: {
                        'Authorization': `Bearer ${token}`
                    }});
                setMessages(response.data);
            } catch (error) {
                console.error('Error deleting message:', error);
            }
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
            <div className="text-center mb-4">
                <h1 className="welcome-message-1">My Messages</h1>
            </div>
            <div className="col-md-12 animated-div">
                <div className="card p-3 mb-4">
                    <div className="chat-box">
                        {messages.map((message) => (
                            <div className="chat-message mb-3" id={`message-${message.id}`} key={message.id}>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <strong>{message.user.username}</strong>: <span
                                        className="message-text">{message.message}</span>
                                    </div>
                                    <div className="text-right">
                                        <small
                                            className="text-muted">{new Date(message.updatedTime).toLocaleString()}</small>
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button className="btn btn-secondary" onClick={() => navigate('/chatroom')}>Back to Chatroom
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserMessages;