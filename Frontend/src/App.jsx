import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import LogIn from './components/LogIn'
import Dashboard from './components/Dashboard'
import Calendar from './components/Calendar';
import List from './components/List';
import ShelfFriends from './components/ShelfFriends';
import Settings from './components/Settings';
import FriendList from './components/FriendList';
import MessagePage from './components/MessagePage';import Recommendations from './components/Recommendations';
import SignUp from './components/SignUp';
import NotificationPane from './components/NotificationPane';
import { useState } from 'react';

function AppRoutes() {

  const [notifications, setNotifications] = useState(() => {
    const stored = sessionStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  });

  const addNotification = (message) => {

    // this part checks for a duplicate message
    if (notifications.some((notif) => notif.message === message)) {
      return;
    }
    // this part ensures that each new notification is added before reload
    setNotifications(prev => {
      const updated = [...prev, { message }];
      sessionStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };
  
  const location = useLocation();
  
  // resets the token, notifications, and automatic report pop up
  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('notifications');
    sessionStorage.removeItem('eventDialogShown');
    setNotifications([]); 
  };

  return (
    <>
      {(location.pathname == '/main' || location.pathname == '/calendar') &&(
        <NotificationPane notifications = {notifications} />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/main" element={<Dashboard notifications={notifications}  logout={logout} />} />
        <Route path="/calendar" element={<Calendar addNotification={addNotification}/>} />
        <Route path="/shelfFriends" element={<ShelfFriends />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/recommendations" element={<Recommendations/>}/>
        <Route path="/friends" element={<FriendList />} />
        <Route path="/messagepage/:userName" element={<MessagePage />} />
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
