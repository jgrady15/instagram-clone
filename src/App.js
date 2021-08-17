import React, { useEffect, useState } from 'react';
import './App.css';
import MainPage from './MainPage.js';
import LandingPage from './LandingPage.js';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className='react-root'>
      <Router>
        {

        }
        <Link to='/' component={MainPage}>
          <MainPage />
        </Link>
        <Link to='' component={LandingPage}>
          <LandingPage />
        </Link>
      </Router>
    </div>
  );
}

export default App;
