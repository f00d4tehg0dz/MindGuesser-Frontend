import React from 'react';
import './App.css';
import Conversation from './components/Conversation';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
       <Header />
      <div className="container mx-auto py-10 px-4">
        <Conversation />
      </div>
    </div>
  );
}

export default App;
