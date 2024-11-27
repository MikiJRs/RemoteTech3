import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInterviewStore from '../stores/interviewStore';

const apiUrl = import.meta.env.VITE_BE_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Store'dan login fonksiyonunu al
  const login = useInterviewStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        login(token);
        console.log('Login successful');
        navigate('/manage-question-package');
      } else {
        console.log('Login failed');
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#004D61] via-[#007965] to-[#003843] animate-bg-move">
      <div className="w-full flex justify-center items-center">
        <div className="w-1/3 bg-[#f3f6f8] p-8 rounded-lg shadow-lg border border-[#cbd5e1] transform animate-slide-in">
          <h2 className="text-2xl font-semibold mb-2 text-center text-[#004D61]">
            Admin Login
          </h2>
          {/* Alt çizgi */}
          <div className="w-full h-[2px] bg-[#004D61] mb-4"></div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-gray-600 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-[#a9b3bb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61] bg-[#eaf0f4]"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-gray-600 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-[#a9b3bb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61] bg-[#eaf0f4]"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && (
              <div className="mb-4 text-red-600 text-center">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-[#004D61] text-white py-2 rounded-lg hover:bg-gradient-to-r hover:from-[#004D61] hover:to-[#007965] transform hover:scale-105 transition-all duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
