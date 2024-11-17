import React from 'react'
/* import Navbar from './Navbar';
import { CreateSegment } from './CreateSegment'; */
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";
export const Home = () => {
    const navigate = useNavigate();
  return (
    <div className='container mt-5'>
        
      <h1 className="home-title">Welcome to the Engage Pro</h1>
      <p className="home-subtitle">Choose an action to get started:</p>

      <div className="action-cards">
        <div
          className="action-card"
          onClick={() => navigate("/create-segment")}
        >
          <div className="card-icon">📊</div>
          <h3>Create Segment</h3>
          <p>Define audience segments with specific criteria.</p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/create-customers")}
        >
          <div className="card-icon">👤</div>
          <h3>Add Customer</h3>
          <p>Add customer data to your database.</p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/orders")}
        >
          <div className="card-icon">🛒</div>
          <h3>Add Order</h3>
          <p>Submit an order and link it to a customer.</p>
        </div>
      </div>
  
    </div>
  )
}
