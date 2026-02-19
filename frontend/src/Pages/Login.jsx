import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Enter email";
    if (!password) newErrors.password = "Enter password";

    return newErrors;
  };

  const handleLogin = async () => {
    setApiError("");
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.errors) {
          setErrors((prev) => ({ ...prev, ...data.errors }));
        }

        if (response.status === 401) {
          setApiError("Invalid email or password");
        } else {
          setApiError(data?.message || "Login failed. Please try again.");
        }
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
    <div>
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-4">
        <div className='bg-white/90 backdrop-blur-sm p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-white/50'>

          <h2 className='text-3xl font-extrabold text-gray-800 text-center mb-4 tracking-tight'>
            LOGIN
          </h2>

          {apiError && (
            <p className="text-red-500 text-sm mb-3 text-center">{apiError}</p>
          )}

          <form onSubmit={(e) => e.preventDefault()}>

            {/* EMAIL */}
            <div>
              <label className='block text-gray-700 font-bold mb-2 text-sm'>Email</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope}/>
                </span>
                <input
                  type="email"
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all text-sm"
                />
              </div>

    
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

          
            <div className="mt-4">
              <label className='block text-gray-700 font-bold mb-2 text-sm'>Password</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400">
                  <FontAwesomeIcon icon={faLock}/>
                </span>
                <input
                  type="password"
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all text-sm"
                />
              </div>

        
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

         
            <button
              type="button"
              onClick={handleLogin}
              disabled={isSubmitting}
              className="w-full bg-rose-400 hover:bg-rose-500 disabled:bg-rose-300 text-white font-bold py-3 rounded-lg shadow-lg shadow-rose-200 transition-all mt-6"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

       
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Don't have an account?
                <span
                  onClick={() => navigate("/register")}
                  className="text-red-400 font-bold hover:underline cursor-pointer ml-1"
                >
                  Register
                </span>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
