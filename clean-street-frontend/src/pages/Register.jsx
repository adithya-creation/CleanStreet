import { useState } from "react";
import Header from "../components/Header";
import bgImage from "../assets/Background.jpeg";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.username || !form.email || !form.password) {
      setError("Please fill all required fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Invalid email format");
      return;
    }

    if (form.phone && form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    alert(`Registered successfully as ${form.role}`);
  };

  return (
    <>
      <Header />

      <div
        className="min-h-screen flex justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl w-[450px] shadow-2xl border border-gray-200">

          <h2 className="text-3xl font-bold text-center mb-6 text-black-100">
            Register for CleanStreet
          </h2>

          <label className="font-semibold text-black-700">Role</label>
          <select
            name="role"
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
          >
            <option value="user">User</option>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
          </select>

          <label className="font-semibold text-black-700">Full Name</label>
          <input
            name="name"
            placeholder="Enter your full name"
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />

          <label className="font-semibold text-black-700">Username</label>
          <input
            name="username"
            placeholder="Enter your username"
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />

          <label className="font-semibold text-black-700">Email</label>
          <input
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />

          <label className="font-semibold text-black-700">Phone Number(Optional)</label>
          <input
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setForm({ ...form, phone: value });
              }
            }}
            maxLength={10}
            className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />

          <label className="font-semibold text-black-700">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />

          {error && (
            <p className="text-red-500 text-center mb-2">{error}</p>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-red-400 hover:bg-red-500 text-white px-10 py-2 rounded-lg font-semibold transition"
            >
              Register
            </button>
          </div>

          <p className="text-center text-red-400 mt-4 font-medium cursor-pointer hover:underline">
            Already have an account? Login
          </p>

        </div>
      </div>
    </>
  );
}
