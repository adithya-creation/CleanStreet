export default function Header() {
  return (
    <div className="flex justify-between items-center px-10 py-4 bg-white shadow-md w-full">
      
      <h1 className="text-teal-700 font-extrabold text-2xl">
        CLEANSTREET
      </h1>

      <div className="space-x-8 font-semibold text-gray-700">
        <span className="hover:text-green-600 cursor-pointer">HOME</span>
        <span className="hover:text-green-600 cursor-pointer">ABOUT</span>
        <span className="hover:text-green-600 cursor-pointer">REPORT ISSUE</span>
        <span className="hover:text-green-600 cursor-pointer">VIEW COMPLAINTS</span>
      </div>

     
      <div className="space-x-4">
        <button className="text-green-700 font-semibold">Login</button>

        <button className="bg-red-400 hover:bg-red-400 text-white px-5 py-2 rounded-lg font-semibold transition">
          Register
        </button>
      </div>

    </div>
  );
}