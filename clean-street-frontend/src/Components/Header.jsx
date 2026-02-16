import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white shadow-md w-full">
      <div className="flex justify-between items-center px-4 md:px-10 py-4">

        <h1 className="text-teal-700 font-extrabold text-xl md:text-2xl">
          CLEANSTREET
        </h1>

        <div className="hidden md:flex space-x-8 font-semibold text-gray-700">
          <span className="hover:text-green-600 cursor-pointer">HOME</span>
          <span className="hover:text-green-600 cursor-pointer">ABOUT</span>
          <span className="hover:text-green-600 cursor-pointer">REPORT ISSUE</span>
          <span className="hover:text-green-600 cursor-pointer">VIEW COMPLAINTS</span>
        </div>

        <div className="flex items-center">

          <div className="hidden md:flex space-x-4">
            <button className="text-green-700 font-semibold">
              Login
            </button>

            <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Register
            </button>
          </div>

          <button
            className="md:hidden text-3xl ml-3"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-white border-t shadow-lg py-4 space-y-4 font-semibold text-gray-700">
          <span className="hover:text-green-600 cursor-pointer">HOME</span>
          <span className="hover:text-green-600 cursor-pointer">ABOUT</span>
          <span className="hover:text-green-600 cursor-pointer">REPORT ISSUE</span>
          <span className="hover:text-green-600 cursor-pointer">VIEW COMPLAINTS</span>
        </div>
      )}
    </div>
  );
}
