import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import InputMask from 'react-input-mask';

const apiUrl = import.meta.env.VITE_BE_URL;


const UserLogin = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isKVKKChecked, setIsKVKKChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [interviewId, setInterviewId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setInterviewId(params.get('interviewId'));
  }, [location.search]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !surname || !email || !phone || !isKVKKChecked) {
      setErrorMessage('All fields must be filled, and the KVKK approval must be confirmed.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/submit`, {
        name,
        surname,
        email,
        phone,
        isKVKKChecked,
      });
      setSuccessMessage('Form submitted successfully!');

      const userId = response.data.userId;

      if (interviewId) {
        navigate(`/interview/${interviewId}?userId=${userId}`);
      } else {
        navigate(`/interviewpage?userId=${userId}`);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'An error occurred while submitting the form.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#004D61] via-[#007965] to-[#003843] animate-bg-move">
      <div className="w-full flex justify-center items-center">
        <div className="w-2/5 bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-[#cbd5e1] transform animate-slide-in">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#004D61]">Personal Information Form</h2>
          {errorMessage && <div className="mb-4 text-red-600 text-center">{errorMessage}</div>}
          {successMessage && <div className="mb-4 text-green-600 text-center">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#004D61] transition"
                placeholder="Enter your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#004D61] transition"
                placeholder="Enter your last name"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#004D61] transition"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Phone</label>
              <InputMask
                mask="(999) 999-9999"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#004D61] transition"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="flex items-center text-gray-700 font-medium">
                <input
                  type="checkbox"
                  checked={isKVKKChecked}
                  onChange={(e) => setIsKVKKChecked(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-[#004D61] rounded focus:ring-[#004D61] transition"
                />
                <span className="ml-2">
                  I have read and agree to the{' '}
                  <a href="/kvkk" className="underline text-blue-600 hover:text-blue-800">KVKK statement</a>.
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-[#004D61] text-white py-2 rounded-md hover:bg-gradient-to-r hover:from-[#004D61] hover:to-[#007965] transform hover:scale-105 transition-all duration-200"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
