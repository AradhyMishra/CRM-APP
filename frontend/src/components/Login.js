import React from 'react';
/* import { useNavigate } from 'react-router-dom'; */
import googleIcon from './google.png'; // Add your Google icon image here.

const LoginPage = () => {
    //const navigate = useNavigate();
    const googleAuth = (e) => {
      e.preventDefault();
      window.open(
        `http://localhost:8080/auth/google/callback`,
        "_self" //to open in the same tab
      );
    }
    

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1d3557, #457b9d, #a8dadc)',
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    background: '#fff',
                    borderRadius: '15px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center',
                    padding: '30px 20px',
                }}
            >
                <h1
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#1d3557',
                        marginBottom: '10px',
                    }}
                >
                    Engage Pro
                </h1>
                <p
                    style={{
                        fontSize: '1.1rem',
                        color: '#457b9d',
                        marginBottom: '30px',
                    }}
                >
                    Your CRM solution to drive better engagement.
                </p>
                <div>
                    <button
                        onClick={googleAuth}
                        style={{
                            backgroundColor: '#fff',
                            color: '#333',
                            border: '2px solid #db4437',
                            padding: '12px 20px',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            width: '100%',
                        }}
                        onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = '#db4437') &&
                            (e.target.style.color = '#fff')
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = '#fff') &&
                            (e.target.style.color = '#333')
                        }
                    >
                        <img
                            src={googleIcon}
                            alt="Google Icon"
                            style={{ width: '20px', height: '20px' }}
                        />
                        Sign in with Google
                    </button>
                </div>
                <p
                    style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        marginTop: '20px',
                    }}
                >
                    By signing in, you agree to our{' '}
                    <a
                        href="/"
                        style={{ color: '#457b9d', textDecoration: 'none' }}
                    >
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                        href="/"
                        style={{ color: '#457b9d', textDecoration: 'none' }}
                    >
                        Privacy Policy
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;



