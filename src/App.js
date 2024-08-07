import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import './App.css';
import Information from './components/Information';
import Conversation from './components/Conversation';
import Header from './components/Header';
import ReactGA from 'react-ga';
  const TRACKING_ID = "G-14G97SSWKG"; // OUR_TRACKING_ID
  ReactGA.initialize(TRACKING_ID);

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="container mx-auto py-10 px-4">
          <Routes>
            <Route path="/" element={<Conversation />} />
            <Route path="/information" element={<Information />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;