import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import './App.css';
import Information from './components/Information';
import Conversation from './components/Conversation';
import Header from './components/Header';

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