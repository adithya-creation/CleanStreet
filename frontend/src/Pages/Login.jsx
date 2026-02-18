import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
const Login = () => {
  return (
    <div>
        <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-4">
            <div className=' bg-white/90 backdrop-blur-sm p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-white/50'>
            <h2 className='text-3xl font-extrabold text-gray-800 text-center mb-8 tracking-tight'>LOGIN</h2>
            <form>
                <div>
                <label className='block text-gray-700 font-bold mb-2 text-sm'>Email</label>
                <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">
                        <FontAwesomeIcon icon={faEnvelope}/>
                    </span>
                    <input type="email" name="email" placeholder='Enter your email'className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all text-sm"/>
                </div>
                </div>
                <div>
                <label className='block text-gray-700 font-bold mb-2 text-sm'>Password</label>
                <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">
                        <FontAwesomeIcon icon={faLock}/>
                    </span>
                    <input type="password" name="password" placeholder='Enter your password'
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all text-sm"/>
                </div>
                </div>
                <button className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-rose-200 transition-all mt-4">
                    Login
                </button>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">Don't have an account? <a href="" className="text-red-400 font-bold hover:underline"> Register</a> </p>
                </div>
                </form></div>
        </div>
    </div>
  )
}

export default Login
