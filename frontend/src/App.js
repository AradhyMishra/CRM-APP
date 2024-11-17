import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login"
import { Signup } from './components/Signup';
import { Home } from './components/Home';
import Navbar from './components/Navbar';
import { CreateSegment } from './components/CreateSegment';
import { PastCampaigns } from './components/PastCampaigns';
import PrevSegments from './components/PrevSegments';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Customer from './components/Customer';
import Order from './components/Order';
import ViewCustomers from './components/ViewCustomers';
import LoadingBar from 'react-top-loading-bar'

function App() {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const getUser = async () => {
    try {
      setLoading(true); // Start loading
      const url = 'http://localhost:8080/auth/login/success';
      const { data } = await axios.get(url, { withCredentials: true });
      setUser(data.user._json);
      console.log(data.user._json);
    } catch (err) {
      console.log('Error fetching user:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.log('Error logging out:', err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>; // Display loading indicator while fetching user
  }

  return (
    <div className="container mt-2">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar user = {user}/>
      <LoadingBar
        color='#f11946'
        progress={progress}
        
      />
        <Routes>
          <Route path="/" element={user ? <Home user={user} onLogout={handleLogout} /> : <Login />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/create-segment" element={user ? <CreateSegment setProgress = {setProgress} /> : <Navigate to="/login" />} />
          <Route path="/past-campaigns" element={user ? <PastCampaigns setProgress = {setProgress}/> : <Navigate to="/login" />} />
          <Route path="/view-segments" element={user ? <PrevSegments setProgress = {setProgress}/> : <Navigate to="/login" />} />
          <Route path="/create-customers" element={user ? <Customer setProgress = {setProgress} /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Order setProgress = {setProgress}/> : <Navigate to="/login" />} />
          <Route path="/create-segments" element={user ? <CreateSegment setProgress = {setProgress}/> : <Navigate to="/login" />} />
          <Route path="/view-customers" element={user ? <ViewCustomers setProgress = {setProgress}/> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
