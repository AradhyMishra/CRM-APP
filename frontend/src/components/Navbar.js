import React from "react";
import { Link } from "react-router-dom";


const Navbar = (props) => {
    const logout = () => {
        window.open(
            `http://localhost:8080/auth/logout`,
            "_self" //to open in the same tab
        );
    };

    return (
        <div style={{ marginBottom: "56px" }}>
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand mx-2" to="/">
                    Engage Pro
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link active" style = {{display: props.user === null?'none':''}} aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" style = {{display: props.user === null?'none':''}} aria-current="page" to="/view-customers">Customers</Link>
                        </li>
                        <li className="nav-item" style = {{display: props.user === null?'none':''}}>
                            <Link className="nav-link active" aria-current="page" to="/view-segments">Segments</Link>
                        </li>
                    </ul>
                    <button type="button" onClick={logout} className="btn btn-secondary mx-3">
                        Logout
                    </button>

                </div>
            </nav>
        </div>
    );
};

export default Navbar;
