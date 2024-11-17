import React, { useState } from "react";
 import axios from "axios"; 


const Customer = (props) => {
  const {setProgress} = props;

   const [customerData, setCustomerData] = useState({
    name: "",
    age: "",
    email: "",
    visits: "",
    netSpend: "",
  }); 

    console.log(customerData);
   const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
    setError(""); // Clear error on input change
    setSuccessMessage(""); // Clear success message
  };

  // Handle form submission
   const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(20);
    // Frontend validation for required fields
    if (!customerData.name.trim() || !customerData.email.trim()) {
      setError("Name and Email are required.");
      return;
    }
    setProgress(40);
    try {
      // Send POST request to the backend
      const response = await axios.post("http://localhost:8080/api/customer", customerData);

      if (response.status === 200) {
        
         setSuccessMessage("Customer added successfully!")
        setCustomerData({
          name: "",
          age: "",
          email: "",
          visits: "",
          netSpend: "",
        });
        setProgress(70);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Handle unique email validation error
        setError(err.response.data.message || "Error adding customer.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setProgress(70);
    }
    setProgress(100);
  }; 

  return (
    <div className="container mt-4">
      <h2>Customer Data Ingestion</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mt-1">
          <label>Name <span style={{ color: "red" }}>*</span></label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={customerData.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
        </div>
        <div className="form-group mt-1">
          <label>Age</label>
          <input
            type="number"
            className="form-control"
            name="age"
            value={customerData.age}
            onChange={handleChange}
            placeholder="Enter age"
          />
        </div>
        <div className="form-group mt-1">
          <label>Email <span style={{ color: "red" }}>*</span></label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={customerData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="form-group mt-1">
          <label>Visits</label>
          <input
            type="number"
            className="form-control"
            name="visits"
            value={customerData.visits}
            onChange={handleChange}
            placeholder="Enter number of visits"
          />
        </div>
        <div className="form-group mt-1">
          <label>Net Spend</label>
          <input
            type="number"
            className="form-control"
            name="netSpend"
            value={customerData.netSpend}
            onChange={handleChange}
            placeholder="Enter net spend"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default Customer;
