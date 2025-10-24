import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../serviceWorkers/authServices';
import AppContext from '../../context/AppContext';

const Register = () => {
  const nav = useNavigate();
  const { setMessage, setError } = useContext(AppContext);
  const [formData, setFormData] = useState({
    uname: '',
    password1: '',
    password2: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.uname.trim() || !formData.password1 || !formData.password2) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password1 !== formData.password2) {
      setError('Passwords does not match.');
      return;
    }

    console.log('Form submitted:', formData);

    register({ uname: formData.uname, password: formData.password1 })
      .then(response => {
        if (response.status == 201 || response.status == 200) {
          setMessage("Registered successfully");
          setFormData({ uname: '', password1: '', password2: '' });
          nav('/login');
        }
      })
      .catch(e => {
        console.log(e.message);
        setError("Failed to register");
      });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Register
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
              className={'w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300'}
            />
          </div>

          <div>
            <label htmlFor="password1" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password1"
              id="password1"
              value={formData.password1}
              onChange={handleChange}
              className={'w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300'}
            />
          </div>

          <div>
            <label htmlFor="password2" className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              id="password2"
              value={formData.password2}
              onChange={handleChange}
              className={'w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300'}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
          >
            Register
          </button>
        </form>

        {/* Login link */}
        <p className="mt-4 text-center text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-500 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
