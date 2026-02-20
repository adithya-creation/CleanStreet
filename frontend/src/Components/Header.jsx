import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-[9999]">
      <div className="flex justify-between items-center px-4 md:px-10 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="text-teal-700 font-extrabold text-xl md:text-2xl"
        >
          CLEANSTREET
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex space-x-8 font-semibold text-gray-700">
          <Link to="/" className="hover:text-green-600">HOME</Link>
          <Link to="/#about" className="hover:text-green-600">ABOUT</Link>
          <Link to="/report" className="hover:text-green-600">REPORT ISSUE</Link>
          <Link to="/complaints" className="hover:text-green-600">VIEW COMPLAINTS</Link>
        </nav>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="text-green-700 font-semibold"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Register
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-3xl ml-3"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-white border-t shadow-lg py-4 space-y-4 font-semibold text-gray-700">
          <Link to="/" onClick={() => setMenuOpen(false)}>HOME</Link>
          <Link to="/#about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
          <Link to="/report" onClick={() => setMenuOpen(false)}>REPORT ISSUE</Link>
          <Link to="/complaints" onClick={() => setMenuOpen(false)}>VIEW COMPLAINTS</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
        </div>
      )}
    </header>
  );
}