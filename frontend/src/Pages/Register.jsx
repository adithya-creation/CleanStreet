import { useState, useEffect } from "react";
import Header from "../components/Header";
import bgImage from "../assets/Background.jpeg";
import { Link } from "react-router-dom";


export default function Register() {
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Full name is required";
    if (!form.username) newErrors.username = "Username is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.phone && form.phone.length !== 10) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert(`Registered successfully as ${form.role}`);
    }
  };

  return (
    <>
      <Header />
<div
  className="min-h-screen w-full flex justify-center items-start pt-2 bg-cover bg-center bg-no-repeat bg-fixed px-4"
  style={{ backgroundImage: `url(${bgImage})` }}
>

        
<div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 -mt-5">

          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Register for CleanStreet
          </h2>

          <label className="font-semibold">Role</label>
          <select
            name="role"
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
          >
            <option value="user">User</option>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
          </select>

          <label className="font-semibold">Full Name</label>
          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {
                setForm({ ...form, name: value });
              }
            }}
            className="w-full p-2 mb-1 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mb-2">{errors.name}</p>
          )}

          <label className="font-semibold">Username</label>
          <input
            name="username"
            placeholder="Enter your username"
            onChange={handleChange}
            className="w-full p-2 mb-1 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mb-2">{errors.username}</p>
          )}

          <label className="font-semibold">Email</label>
          <input
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full p-2 mb-1 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email}</p>
          )}

          <label className="font-semibold">
            Phone Number (Optional)
          </label>
          <input
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setForm({ ...form, phone: value });
              }
            }}
            maxLength={10}
            className="w-full p-2 mb-1 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
          )}

          <label className="font-semibold">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={handleChange}
            className="w-full p-2 mb-1 border rounded-lg focus:ring-2 focus:ring-teal-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password}</p>
          )}

          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              className="bg-red-400 hover:bg-red-500 text-white px-10 py-2 rounded-lg font-semibold transition"
            >
              Register
            </button>
          </div>

          <Link to="/login">
  <p className="text-center text-red-400 mt-4 font-medium cursor-pointer hover:underline">
    Already have an account? Login
  </p>
</Link>


        </div>
      </div>
    </>
  );
}
