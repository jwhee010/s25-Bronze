import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import LogIn from './components/LogIn'
import Dashboard from './components/Dashboard'
import Calendar from './components/Calendar';
import List from './components/List';


export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/main" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/list" element={<List />} />
      </Routes>
    </Router>
   
   
  );
}
