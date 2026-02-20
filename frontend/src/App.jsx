import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./Pages/Footer";

import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";

function App() {
  return (
   <Router>
  <Header />

  {/* MAIN CONTENT */}
  <main className="pt-20 min-h-[calc(100vh-80px)]">
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </main>

  <Footer />
</Router>
  );
}

export default App;