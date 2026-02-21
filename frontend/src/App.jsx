import './App.css';
import Navbar from './Pages/NavBar';
import Dashboard from './Pages/Dashboard';
import Footer from './Pages/Footer';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profiledas from "./Pages/Profiledas";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profiledas" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
