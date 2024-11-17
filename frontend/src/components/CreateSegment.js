import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const CreateSegment = (props) => {
    const [conditions, setConditions] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [segmentName, setSegmentName] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [segmentCreated, setSegmentCreated] = useState(false);
    const [messageTemplate, setMessageTemplate] = useState('');
    const [segmentId, setSegmentId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const addCondition = () => {
        setConditions([...conditions, { field: '', operator: '', value: '', logic: 'AND' }]);
    };

    const updateCondition = (index, key, value) => {
        const newConditions = [...conditions];
        newConditions[index][key] = value;
        setConditions(newConditions);
    };

    const deleteCondition = (index) => {
        const newConditions = conditions.filter((_, i) => i !== index);
        setConditions(newConditions);
    };

    const viewFilteredCustomers = async () => {
        try {
            
            const response = await axios.get('http://localhost:8080/api/fetchCustomers');
            if (response.data && response.data.customers) {
                const customers = response.data.customers;

                const filtered = customers.filter(customer => {
                    return conditions.reduce((result, condition) => {
                        const fieldMatch = compare(customer[condition.field], condition.operator, condition.value);
                        return condition.logic === 'AND' ? result && fieldMatch : result || fieldMatch;
                    }, true);
                });

                setFilteredCustomers(filtered);
                setMessageType('success');
                setMessage(`Filtered customers loaded. Segment size: ${filtered.length}`);
            } else {
                setMessageType('error');
                setMessage('No customers found');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setMessageType('error');
            setMessage('Error fetching customers');
        }
    };

    const compare = (fieldValue, operator, value) => {
        switch (operator) {
            case '>': return fieldValue > value;
            case '<': return fieldValue < value;
            case '>=': return fieldValue >= value;
            case '<=': return fieldValue <= value;
            default: return true;
        }
    };

    const createSegment = async () => {
        try {
            // Fetch customers from the backend
            const response = await axios.get('http://localhost:8080/api/fetchCustomers');
            props.setProgress(20);
    
            if (response.data && response.data.customers) {
                const customers = response.data.customers;
    
                // Apply filtering logic
                const filtered = customers.filter(customer => {
                    return conditions.reduce((result, condition) => {
                        const fieldMatch = compare(customer[condition.field], condition.operator, condition.value);
                        return condition.logic === 'AND' ? result && fieldMatch : result || fieldMatch;
                    }, true);
                });
    
                // Ensure filtered customers are correctly set
                setFilteredCustomers(filtered);
    
                // Map filtered customers to extract their IDs
                const customerIds = filtered.map(customer => customer._id);
    
                // Prepare segment data
                const segmentData = {
                    name: segmentName,
                    conditions,
                    customerIds,
                };
    
                props.setProgress(60);
    
                // Make API call to create the segment
                const segmentResponse = await axios.post('http://localhost:8080/api/createSegment', segmentData);
    
                if (segmentResponse.data && segmentResponse.data.segment) {
                    setMessage(segmentResponse.data.message);
                    setMessageType('success');
                    setSegmentCreated(true);
                    setSegmentId(segmentResponse.data.segment._id);
                } else {
                    setMessage('Unexpected error in segment creation');
                    setMessageType('error');
                }
            } else {
                setMessage('No customers available to create a segment');
                setMessageType('error');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setMessage('A segment already exists with these conditions or name');
            } else {
                setMessage('Error creating segment');
            }
            setMessageType('error');
        }
    
        props.setProgress(100);
    };
    

    const sendMessage = async () => {
        if (!segmentId) {
            setMessage('Error: Segment ID is missing');
            setMessageType('error');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/api/sendCampaign', {
                segmentId,
                messageTemplate
            });
            setMessage(response.data.message);
            setMessageType('success');
        } catch (error) {
            console.error('Error sending messages:', error);
            setMessage('Error sending messages');
            setMessageType('error');
        }
    };

    const viewPastCampaigns = () => {
        console.log(segmentId);
        navigate('/past-campaigns', { state: { segmentId } });
    };

    return (
        <div className="container mt-3">
            <h2 className="mt-2">Create Audience Segment</h2>

            {message && (
                <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                </div>
            )}

            <form className="mt-3" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                    <label htmlFor="segmentName" className="form-label">Segment Name</label>
                    <input
                        type="text"
                        id="segmentName"
                        className="form-control"
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                        placeholder="Enter segment name"
                        required
                    />
                </div>

                {conditions.map((condition, index) => (
                    <div key={index} className="mb-3">
                        <div className="d-flex align-items-center">
                            <select
                                className="form-select me-2"
                                onChange={(e) => updateCondition(index, 'field', e.target.value)}
                                value={condition.field}
                            >
                                <option value="">Select field</option>
                                <option value="totalSpend">Net Spend</option>
                                <option value="visits">Visits</option>
                                <option value="lastVisitDate">Last Visit (months ago)</option>
                            </select>

                            <select
                                className="form-select me-2"
                                onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                                value={condition.operator}
                            >
                                <option value="">Select operator</option>
                                <option value=">">Greater than</option>
                                <option value="<">Less than</option>
                                <option value=">=">Greater than or equal to</option>
                                <option value="<=">Less than or equal to</option>
                            </select>

                            <input
                                type="number"
                                className="form-control me-2"
                                placeholder="Enter value"
                                onChange={(e) => updateCondition(index, 'value', e.target.value)}
                                value={condition.value}
                            />

                            {index > 0 && (
                                <select
                                    className="form-select me-2"
                                    onChange={(e) => updateCondition(index, 'logic', e.target.value)}
                                    value={condition.logic}
                                >
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                </select>
                            )}

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => deleteCondition(index)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                <button type="button" className="btn btn-secondary mt-3" onClick={addCondition}>
                    Add Condition
                </button>
            </form>

            <div className="d-flex align-items-center justify-content-between mt-3">
                <div>
                    <button type="button" className="btn btn-info mx-2" onClick={viewFilteredCustomers}>
                        View Filtered Customers
                    </button>

                    <button type="button" className="btn btn-primary mx-2" onClick={createSegment}>
                        Create Segment
                    </button>
                </div>

                {segmentCreated && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <input
                            type="text"
                            className="form-control mb-2"
                            style={{ width: '300px' }}
                            placeholder="Enter message (e.g., Hi [Name], here’s 10% off on your next order!)"
                            value={messageTemplate}
                            onChange={(e) => setMessageTemplate(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={sendMessage}>Send Message</button>
                        <button className="btn btn-secondary mt-2" onClick={viewPastCampaigns}>
                            View Past Campaigns
                        </button>
                    </div>
                )}
            </div>

            {filteredCustomers.length > 0 && (
                <div className="customer-list mt-4">
                    <h3>Filtered Customers</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {filteredCustomers.map((customer) => (
                            <li
                                key={customer._id}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    margin: '5px 0',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <strong>{customer.name}</strong> - {customer.email}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
