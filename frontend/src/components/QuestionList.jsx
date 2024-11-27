import React, { useState } from 'react';

const QuestionListModal = ({ isOpen, onClose, questions, onAddExtraQuestion }) => {
  const [extraQuestionModalOpen, setExtraQuestionModalOpen] = useState(false);
  const [extraQuestionText, setExtraQuestionText] = useState('');
  const [extraQuestionMinutes, setExtraQuestionMinutes] = useState(0);
  const [error, setError] = useState(''); // Hata mesajı için state

  const handleSaveExtraQuestion = () => {
    if (!extraQuestionText) {
      setError("Question text is required.");
      return;
    }
    if (extraQuestionMinutes <= 0) {
      setError("Time must be greater than 0.");
      return;
    }

    const newExtraQuestion = {
      questionText: extraQuestionText,
      question_time: { minutes: extraQuestionMinutes }
    };
    console.log("new extra questions= " + newExtraQuestion)
    onAddExtraQuestion(newExtraQuestion);
    setExtraQuestionText('');
    setExtraQuestionMinutes(0);
    setExtraQuestionModalOpen(false);
    setError(''); // Hata mesajını temizle
  };

  if (!isOpen) return null;

  questions.map((question) => {
    console.log(question)
  })

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Question List</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition duration-200">
                  <span className="text-gray-700 font-medium">{question.questionText}</span>
                  
                </div>
              ))
            ) : (
              <p className="text-gray-500">No questions available.</p>
            )}
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={() => setExtraQuestionModalOpen(true)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none transition duration-200"
            >
              Add Extra Question
            </button>
          </div>
        </div>
      </div>

      {extraQuestionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add Extra Question</h2>

            {/* Hata mesajı */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Ekstra Soru Ekleme Formu */}
            <div className="mb-4">
              <label className="block mb-2">Question</label>
              <input
                type="text"
                value={extraQuestionText}
                onChange={(e) => setExtraQuestionText(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter question text"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Time</label>
              <input
                type="number"
                value={extraQuestionMinutes}
                onChange={(e) => setExtraQuestionMinutes(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                placeholder="Enter time in minutes"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setExtraQuestionModalOpen(false)} className="bg-[#504D61] text-white px-4 py-2 rounded-md hover:bg-[#003843] transition">Cancel</button>
              <button onClick={handleSaveExtraQuestion} className="bg-[#004D61] text-white px-4 py-2 rounded-md hover:bg-[#003843] transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionListModal;
