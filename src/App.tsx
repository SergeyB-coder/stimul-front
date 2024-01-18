import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import { Start } from './components/start';
import { Login } from './components/login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route
                path="/"
                element={
                <Login/>
                }
            />
            <Route
                path="/start"
                element={
                <Start/>
                }
            />
            
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
