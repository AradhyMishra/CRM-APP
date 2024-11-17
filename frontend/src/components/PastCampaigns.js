import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const PastCampaigns = (props) => {
    const {setProgress} = props;
    const { state } = useLocation();
    const segmentId = state?.segmentId; // Safely access segmentId from the state
    const [customers, setCustomers] = useState([]);
    const [campaignsData, setCampaignsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCustomers, setExpandedCustomers] = useState(new Set()); // Track expanded customers
    const [statistics, setStatistics] = useState({
        audienceSize: 0,
        messagesSent: 0,
        messagesFailed: 0,
        totalMessages: 0,
        successRate: 0,
        failureRate: 0,
    });

    useEffect((props) => {
        const fetchSegmentData = async () => {
            setProgress(20);
            // eslint-disable-next-line
            try {
                if (!segmentId) return;

                // Fetch customers associated with the segment
                const customersResponse = await axios.get(`http://localhost:8080/api/getSegmentCustomers/${segmentId}`);
                const customerList = customersResponse.data.customers || [];
                setCustomers(customerList);
                setProgress(40);
                // Update audience size
                const audienceSize = customerList.length;

                // Fetch campaigns sent to those customers
                const customerIds = customerList.map((customer) => customer._id);
                if (customerIds.length > 0) {
                    const campaignsResponse = await axios.post('http://localhost:8080/api/getCampaignsForCustomers', {
                        customerIds,
                    });

                    // Sort campaigns by `sentAt` in descending order
                    const sortedCampaigns = campaignsResponse.data.campaigns.sort((a, b) =>
                        new Date(b.sentAt) - new Date(a.sentAt)
                    );
                    setProgress(60);
                    // eslint-disable-next-line
                    setCampaignsData(sortedCampaigns || []);

                    // Calculate statistics
                    const messagesSent = sortedCampaigns.filter((c) => c.status === 'SENT').length;
                    const messagesFailed = sortedCampaigns.filter((c) => c.status === 'FAILED').length;
                    const totalMessages = messagesSent + messagesFailed;
                    const successRate = ((messagesSent / totalMessages) * 100).toFixed(2);
                    const failureRate = ((messagesFailed / totalMessages) * 100).toFixed(2);
                    setProgress(80);
                    setStatistics({
                        audienceSize,
                        messagesSent,
                        messagesFailed,
                        totalMessages,
                        successRate,
                        failureRate,
                    });
                    
                }
            } catch (error) {
                console.error('Error fetching segment or campaigns:', error);
            } finally {
                setLoading(false);
            }
            setProgress(100);
            // eslint-disable-next-line
        };

        fetchSegmentData();
        // eslint-disable-next-line
    }, [segmentId]);

    const toggleExpanded = (customerId) => {
        setExpandedCustomers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(customerId)) {
                newSet.delete(customerId);
            } else {
                newSet.add(customerId);
            }
            return newSet;
        });
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(date).toLocaleString('en-US', options).replace(',', '');
    };

    if (!segmentId) {
        return <p>No segment selected. Please go back and select a segment.</p>;
    }

    // Group campaigns by customer
    const groupedCampaigns = customers.map((customer) => {
        const customerCampaigns = campaignsData.filter(
            (campaign) => campaign.customerId?._id === customer._id
        );
        return {
            customer,
            campaigns: customerCampaigns,
        };
    });

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-primary">Past Campaigns for Segment</h2>
            {!loading && (
                <div
                    className="statistics p-4 mb-4"
                    style={{
                        backgroundColor: '#e9f7f9',
                        border: '1px solid #d1e7ec',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <h5 className="text-secondary mb-3">Statistics</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <p><strong>Audience Size:</strong> {statistics.audienceSize}</p>
                            <p><strong>Total Messages:</strong> {statistics.totalMessages}</p>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Messages Sent:</strong> {statistics.messagesSent}</p>
                            <p><strong>Messages Failed:</strong> {statistics.messagesFailed}</p>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Success Rate:</strong> {statistics.successRate}%</p>
                            <p><strong>Failure Rate:</strong> {statistics.failureRate}%</p>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    {groupedCampaigns.length > 0 ? (
                        <table className="table table-hover table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Messages Sent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedCampaigns.map(({ customer, campaigns }, index) => (
                                    <tr key={index}>
                                        <td>
                                            <strong>{customer.name}</strong>
                                            <br />
                                            <small className="text-muted">{customer.email}</small>
                                        </td>
                                        <td>
                                            <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
                                                {(expandedCustomers.has(customer._id)
                                                    ? campaigns
                                                    : campaigns.slice(0, 3)
                                                ).map((campaign, i) => (
                                                    <li
                                                        key={i}
                                                        style={{
                                                            marginBottom: '10px',
                                                            backgroundColor: '#f8f9fa',
                                                            padding: '10px',
                                                            borderRadius: '5px',
                                                            border: '1px solid #dcdcdc',
                                                        }}
                                                    >
                                                        <strong>Message:</strong> {campaign.message}
                                                        <br />
                                                        <strong>Status:</strong>{' '}
                                                        <span
                                                            style={{
                                                                color: campaign.status === 'SENT' ? 'green' : 'red',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            {campaign.status}
                                                        </span>
                                                        <br />
                                                        <strong>Sent At:</strong> {formatDate(campaign.sentAt)}
                                                    </li>
                                                ))}
                                            </ul>
                                            {campaigns.length > 3 && (
                                                <button
                                                    className="btn btn-sm btn-link"
                                                    onClick={() => toggleExpanded(customer._id)}
                                                >
                                                    {expandedCustomers.has(customer._id)
                                                        ? 'View Less'
                                                        : 'View All'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No data available for this segment.</p>
                    )}
                </>
            )}
        </div>
    );
};
