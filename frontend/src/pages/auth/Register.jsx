import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../serviceWorkers/authServices';
import AppContext from '../../context/AppContext';

const Register = () => {
  const nav = useNavigate();
  const { setMessage, setError } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    register({ uname: formData.uname, password: formData.password1 })
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          setMessage("Registered successfully");
          setFormData({ uname: '', password1: '', password2: '' });
          nav('/login');
        }
      })
      .catch((e) => {
        setError(e.message);
        console.log(e.message);
      })
      .finally(() => setLoading(false));
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
            disabled={loading}
            className="w-full py-2 px-4 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
          5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 
          5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
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
