import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Styles from "../PrevSegments.module.css"

export default function PrevSegments(props) {
    const [segments, setSegments] = useState([]);
    const navigate = useNavigate();
    const { setProgress } = props;
    const [messageTemplate, setMessageTemplate] = useState('');
    const [activeSegmentId, setActiveSegmentId] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        setProgress(20);
        const fetchSegments = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/fetchSegments');
                setSegments(response.data || []);
            } catch (error) {
                console.error('Error fetching segments:', error);
            }
        };
        setProgress(60);
        fetchSegments();
        setProgress(100);

        // eslint-disable-next-line
    }, []);

    const handleViewCampaigns = (segmentId) => {
        navigate('/past-campaigns', { state: { segmentId } });
    };

    const handleDeleteSegment = async (segmentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/deleteSegment/${segmentId}`);

            setSegments(segments.filter(segment => segment._id !== segmentId));
        } catch (error) {
            console.error('Error deleting segment:', error);
        }
    };

    const handleSendMessage = async (segmentId) => {
        if (!messageTemplate.trim()) {
            setMessageType('error');
            setMessage('Message cannot be empty');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/sendCampaign', {
                segmentId,
                messageTemplate
            });
            
            setMessage(response.data.message || 'Message sent successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Error sending messages:', error);
            setMessageType('error');
            setMessage('Error sending messages');
        } finally {
            setActiveSegmentId(null);
            setMessageTemplate('');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Previous Segments</h2>

            {message && (
                <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                </div>
            )}

            {segments.length > 0 ? (
                <table className="table table-striped table-hover table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Segment Name</th>
                            <th>Segment Size</th>
                            <th>Created At</th>
                            <th>Actions</th>
                            <th>Delete</th> {/* New Delete Column */}
                        </tr>
                    </thead>
                    <tbody>
                        {segments.map((segment) => (
                            <tr key={segment._id}>
                                <td>{segment.name}</td>
                                <td>{segment.audienceSize}</td>
                                <td>{new Date(segment.createdAt).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleViewCampaigns(segment._id)}
                                    >
                                        View Campaigns
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveSegmentId(
                                                activeSegmentId === segment._id ? null : segment._id
                                            )
                                        }
                                        className="btn btn-info btn-sm mx-5"
                                    >
                                        Send Campaign
                                    </button>
                                    {activeSegmentId === segment._id && (
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                style={{ width: '300px' }}
                                                placeholder="Hi [Name], here’s 10% off on your next order!"
                                                value={messageTemplate}
                                                onChange={(e) => setMessageTemplate(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleSendMessage(segment._id)}
                                            >
                                                Send Message
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="text-center">
                                    <i
                                        className="fas fa-trash text-danger"
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            padding: '4px'
                                        }}
                                        onClick={() => handleDeleteSegment(segment._id)}
                                        title="Delete Segment"
                                    ></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No segments found.</p>
            )}
        </div>
    );
}
