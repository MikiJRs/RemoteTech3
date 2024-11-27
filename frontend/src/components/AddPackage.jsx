import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuestionPackageStore from '../stores/questionPackageStore';

const AddPackage = () => {
  const navigate = useNavigate();
  const [packageName, setPackageName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: '', time: '' });
  const [errorMessage, setErrorMessage] = useState('');

  // Store'dan addPackage fonksiyonunu alıyoruz
  const { addPackage, loading } = useQuestionPackageStore();

  const handleAddQuestion = () => {
    setShowModal(true);
    setErrorMessage('');
  };

  const handleQuestionChange = (id, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, question: value } : q));
  };

  const handleSaveQuestion = () => {
    if (!newQuestion.question.trim()) {
      setErrorMessage('Please enter a question.');
      return;
    }
    if (!newQuestion.time.trim()) {
      setErrorMessage('Please enter the question time.');
      return;
    }
    if (Number(newQuestion.time) <= 0) {
      setErrorMessage('Question time cannot be negative or zero.');
      return;
    }

    setQuestions([...questions, { id: questions.length + 1, question: newQuestion.question, time: newQuestion.time }]);
    setNewQuestion({ question: '', time: '' });
    setShowModal(false);
    setErrorMessage('');
  };

  const handleSave = async () => {
    if (!packageName.trim()) {
      setErrorMessage('Please enter the package name.');
      return;
    }

    if (questions.length === 0) {
      setErrorMessage('You must include at least one question.');
      return;
    }

    // Kontrol: Her sorunun bir `questionText` alanına sahip olduğundan emin ol
    const invalidQuestions = questions.some(q => !q.question.trim());
    if (invalidQuestions) {
      setErrorMessage('Please make sure that all questions are filled.');
      return;
    }

    try {
      // Backend'e paketi kaydediyoruz
      await addPackage({ packageName: packageName.trim(), questions: questions.map(q => ({ questionText: q.question.trim(), time: q.time })) });
      navigate('/manage-question-package');
    } catch (err) {
      console.error('Package could not be saved:', err);
    }
  };

  return (
    <div className="relative h-screen">
      {/* Sol Münü (arka planda tam ekran kaplayacak) */}
      <div className="fixed top-0 left-0 h-full w-full bg-gradient-to-b from-[#004D61] to-[#002D3A] z-0">
        {/* Münü içeriği %20'lik alana sığdırılacak */}
        <div className="h-[20%] w-[20%] p-6 flex flex-col items-center">
          <img src="/remote.svg" alt="Admin Panel Logo" className="w-36 h-36 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2 text-left w-full">Menu</h3>
          <hr className="border-t-2 border-white mb-4 w-full" />
          <ul className="w-full">
            <li className="mb-4">
              <a
                onClick={() => navigate('/manage-question-package')}
                className={`text-gray-200 hover:text-[#00A19D] cursor-pointer px-4 py-2 rounded-md w-full transition-colors duration-200 ${window.location.pathname.includes('/manage-question-package') || window.location.pathname === '/'
                  ? 'bg-[#003843] text-white'
                  : ''
                  }`}
              >
                Manage Question Package
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate('/interviewlist')}
                className={`text-gray-200 hover:text-[#00A19D] cursor-pointer px-4 py-2 rounded-md w-full transition-colors duration-200 ${window.location.pathname.includes('/interviewlist') ? 'bg-[#003843] text-white' : ''
                  }`}
              >
                Interview List
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Sağ İçerik Alanı */}
      <div className="absolute right-0 w-[80%] h-full bg-[#F9F9F9] z-10 rounded-l-[40px] overflow-hidden shadow-lg p-8">
        {/* Üst kısım - Remote-tech Admin Page ve Çıkış Butonu */}
        <div className="flex justify-between items-center p-3 border-b border-gray-300">
          <h1 className="text-2xl font-semibold text-[#002D3A]">Add Package</h1>
          <div className="flex items-center">
            <button
              className="bg-[#004D61] text-white px-3 py-2 rounded-md hover:bg-[#003843] transition"
              onClick={() => navigate('/login')}
            >
              Logout
            </button>
          </div>
        </div>

        {/* İçerik Alanı */}
        <div className="mt-6">
          {/* Paket Başlığı ve Soru Ekleme Butonu */}
          <div className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Package Title..."
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              className="flex-grow p-2 border rounded-md mr-2"
            />
            <button onClick={handleAddQuestion} className="bg-[#004D61] text-white px-4 py-2 rounded-md hover:bg-[#003843] transition">Add Question</button>
          </div>




          {/* Soru Listesi */}
          <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-y-auto max-h-96">
            <div className="grid grid-cols-12 gap-2 font-semibold text-gray-700 mb-4 border-b pb-2">
              <span className="col-span-1">Order No</span>
              <span className="col-span-8">Question Content</span>
              <span className="col-span-2">Time</span>
              <span className="col-span-1 text-center">Action</span>
            </div>

            {questions.map((q, index) => (
              <div key={q.id ? q.id : `question-${index}`} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 mb-2 rounded-lg shadow-lg">
                {/* Order No */}
                <span className="col-span-1">{index + 1}</span>

                {/* Question Content */}
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  className="col-span-8 p-2 border border-gray-300 rounded-lg hover:border-gray-500"
                  placeholder="Bir soru yaz..."
                />

                {/* Time */}
                <input
                  type="number"
                  value={q.time}
                  onChange={(e) => setQuestions(questions.map((question, i) => i === index ? { ...question, time: e.target.value } : question))}
                  className="col-span-2 p-2 border border-gray-300 rounded-lg hover:border-gray-500"
                  placeholder="Zaman (dakika)"
                  min="1"
                  required
                />

                {/* Action - Delete Button */}
                <div className="col-span-1 flex justify-end items-center">
                  <button
                    aria-label="Delete question"
                    onClick={() => setQuestions(questions.filter(question => question.id !== q.id))}
                    className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors duration-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>





          {/* Hata Mesajı */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          {/* Soru Ekleme ve Kaydetme Butonları */}
          <div className="flex justify-between">
            <button className="bg-gray-400 text-white p-3 px-6 rounded-lg shadow-md hover:bg-gray-400 transition duration-200"
              onClick={() => navigate('/manage-question-package')}>Cancel</button>
            <button onClick={handleSave} className="bg-[#004D61] text-white p-2 w-24 rounded">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>



      {/* Soru Ekleme Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative z-60 transform transition-transform duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-[#004D61]">Add New Question</h2>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-lg font-semibold text-[#002D3A]">Question</label>
              <textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#00A19D] focus:border-[#00A19D] transition duration-200"
                placeholder="Enter your question here..."
                rows="3"
              />
            </div>

            {/* Hata Mesajı */}
            {errorMessage && (
              <div className="flex items-center text-red-500 text-sm mb-4">
                <span className="material-icons mr-2">error_outline</span>
                {errorMessage}
              </div>
            )}

            <div className="flex items-center mb-6 bg-gray-100 p-3 rounded-lg shadow-inner">
              <div className="flex items-center border border-gray-300 rounded-lg mr-auto p-2">
                <input
                  type="number"
                  value={newQuestion.time}
                  onChange={(e) => setNewQuestion({ ...newQuestion, time: e.target.value })}
                  className="w-16 p-2 border-r rounded-l focus:outline-none focus:ring-4 focus:ring-[#00A19D]"
                  placeholder="Enter duration in minutes..."
                />
                <span className="p-2 text-gray-500">min</span>
              </div>
            </div>

            <div className="flex justify-between space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white p-3 px-6 rounded-lg shadow-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                className="bg-[#004D61] text-white p-3 px-6 rounded-lg shadow-md hover:bg-[#003843] transition duration-200"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddPackage;