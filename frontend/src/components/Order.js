import React, { useState } from "react";
import axios from "axios";

const OrderIngestion = (props) => {
  const [orderData, setOrderData] = useState({
    customerId: "",
    amount: "",
  });
  const {setProgress} = props;
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
    setError(""); // Clear error on input change
    setSuccessMessage(""); // Clear success message
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(20);
    // Frontend validation for required fields
    if (!orderData.customerId.trim() || !orderData.amount.trim()) {
      setError("Customer ID and Order Amount are required.");
      return;
    }
    setProgress(40);
    if (isNaN(orderData.amount) || Number(orderData.amount) <= 0) {
      setError("Order Amount must be a valid positive number.");
      return;
    }

    try {
      // Send POST request to the backend
      const response = await axios.post("http://localhost:8080/api/order", orderData);
      setProgress(60);
      if (response.status === 200) {
        setSuccessMessage("Order processed successfully! Order details have been sent to our processing system.");
        setOrderData({
          customerId: "",
          amount: "",
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Handle invalid customer ID or other validation errors
        setError(
          err.response.data ||
            "The provided Customer ID is invalid. Please check and try again."
        );
      } else {
        setError("Please Make sure the Customer Id is valid.");
      }
    }
    setProgress(100);
  };

  return (
    <div className="container mt-4">
      <h2>Order Data Ingestion</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Customer ID <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="customerId"
            value={orderData.customerId}
            onChange={handleChange}
            placeholder="Enter Customer ID"
            required
          />
        </div>
        <div className="form-group">
          <label>
            Order Amount <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="amount"
            value={orderData.amount}
            onChange={handleChange}
            placeholder="Enter Order Amount"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderIngestion;
