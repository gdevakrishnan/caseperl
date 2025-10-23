import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    uname: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.uname.trim() || !formData.password) {
      alert('Please fill in all fields.');
      return;
    }

    console.log('Login submitted:', formData);

    setFormData({ uname: '', password: '' });

    alert('Login successful! (Check console for submitted data)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="uname" className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              name="uname"
              id="uname"
              value={formData.uname}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
          >
            Login
          </button>
        </form>

        {/* Register link */}
        <p className="mt-4 text-center text-gray-700">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-500 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
