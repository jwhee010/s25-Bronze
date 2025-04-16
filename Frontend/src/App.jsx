import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import LogIn from './components/LogIn'
import Dashboard from './components/Dashboard'
import Calendar from './components/Calendar';
import List from './components/List';
import ShelfFriends from './components/ShelfFriends';
import Settings from './components/Settings';
import FriendList from './components/FriendList';
import NotificationPane from './components/NotificationPane';
import { useState } from 'react';

function AppRoutes() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications((prev) => [ ...prev, { message }]);
  };
  const location = useLocation();

  return (
    <>
      {(location.pathname == '/main' || location.pathname == '/calendar') &&(
        <NotificationPane notifications = {notifications} />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/main" element={<Dashboard notifications={notifications} />} />
        <Route path="/calendar" element={<Calendar addNotification={addNotification}/>} />
        <Route path="/shelfFriends" element={<ShelfFriends />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/friends" element={<FriendList />} />
      </Routes>
    </>
  );
}

export default function App() {

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
