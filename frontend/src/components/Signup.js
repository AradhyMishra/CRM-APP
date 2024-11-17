import React from "react";
import { Link } from "react-router-dom";
export const Signup = () => {
  const googleAuth = (e) => {
    e.preventDefault();
    window.open(
      `http://localhost:8080/auth/google/callback`,
      "_self" //to open in the same tab
    );
  };
  return (
    <div className="container mt-4">
        <h2 className="mt-2">Signup:</h2>
      <form>
      <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            aria-describedby="emailHelp"
          />
          
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            autoComplete="email"
          />
          
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            autoComplete="current-password"
          />
        </div>
       
        <button type="submit" onClick = {googleAuth} className="btn btn-primary">
          Signup with Google
        </button>
        <div className="mt-2">
          <Link to = "/login"> Already have account?</Link>
        </div>
      </form>
    </div>
  );
};
