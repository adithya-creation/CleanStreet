import { useState, useEffect } from "react";
import Header from "../components/Header";
import bgImage from "../assets/Background.jpeg";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

export default function Register() {
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

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

    return newErrors;
  };

  const handleSubmit = async () => {
    setApiError("");

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          // username and phone are currently client-side only;
          // you can map them to backend fields later if needed.
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.errors) {
          setErrors((prev) => ({ ...prev, ...data.errors }));
        }
        setApiError(data?.message || "Registration failed. Please try again.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/dashboard");
    } catch (err) {
      setApiError("Unable to connect to server. Please try again later.");
    } finally {
      setIsSubmitting(false);
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

          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Register for CleanStreet
          </h2>

          {apiError && (
            <p className="text-red-500 text-sm mb-3 text-center">{apiError}</p>
          )}

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
              disabled={isSubmitting}
              className="bg-red-400 hover:bg-red-500 disabled:bg-red-300 text-white px-10 py-2 rounded-lg font-semibold transition"
            >
              {isSubmitting ? "Registering..." : "Register"}
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
