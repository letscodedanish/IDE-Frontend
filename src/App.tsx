import './App.css'
import { CodingPage } from './components/CodingPage'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from './components/Dashboard';
import  Profile  from './components/Profile';
import io from 'socket.io-client';
import ContestCalendar from './components/ContestCalendar';
const socket = io("http://localhost:3001");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Dashboard socket={socket} />} /> 
        <Route path="/event-tracker" element={<ContestCalendar/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
