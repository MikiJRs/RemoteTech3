import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const apiUrl = import.meta.env.VITE_BE_URL;

const InterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [closeNotification, setCloseNotification] = useState(false);

  const { interviewId } = useParams();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('userId');

  useEffect(() => {
    if (interviewId) {
      fetchQuestions(interviewId);
    }
    startCamera();
  }, [interviewId]);

  const fetchQuestions = async (interviewId) => {
    try {
      const response = await fetch(`${apiUrl}/getQuestions/` + interviewId);
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera or microphone:', error);
    }
  };

  useEffect(() => {
    if (videoStarted) {
      startRecording();
      startTimer();
    } else {
      stopRecording();
      stopTimer();
    }
  }, [videoStarted]);

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoBlob(blob);
    };

    setMediaRecorder(recorder);
    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    setVideoStarted(false);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const uploadVideo = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('interviewId', interviewId);
    formData.append('userId', userId);

    try {
      const response = await axios.post(`${apiUrl}/videos`, formData);
      setVideoUploaded(true);
      setCloseNotification(true);
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    stopRecording();
    stopTimer();
    setSuccessMessage('Interview Completed Successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000); // 3 saniye sonra otomatik olarak kapat
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#004D61] via-[#007965] to-[#003843] animate-bg-move">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl relative">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-[#00A19D] h-4 rounded-full transition-all duration-300"
            style={{ width: videoStarted ? `${((currentQuestion + 1) / questions.length) * 100}%` : '0%' }}
          ></div>
        </div>
        <div className="flex gap-8">
          {/* Kamera Alanı */}
          <div className="w-2/3 bg-gray-100 p-6 rounded-lg shadow-inner flex items-center justify-center relative">
            <video ref={videoRef} autoPlay muted className="w-full h-[500px] border border-gray-300 rounded-lg shadow-md" />
            {videoStarted && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                REC
              </div>
            )}
          </div>

          {/* Sorular Alanı */}
          <div className="w-1/3 bg-gray-100 p-6 rounded-lg shadow-inner flex flex-col justify-between">
            {videoStarted && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-4"
              >
                <div className="bg-gradient-to-r from-[#004D61] to-[#007965] text-white rounded-lg w-full py-4 flex items-center justify-center text-xl font-bold shadow-md transition-all duration-200">
                  Question {currentQuestion + 1} of {questions.length}
                </div>

                <div className="text-lg font-medium text-gray-700 mt-6 max-h-40 overflow-y-auto">
                  {questions[currentQuestion]?.questionText}
                </div>
                <div className="text-sm font-medium text-gray-500 mt-2">
                  Time Elapsed: {Math.floor(elapsedTime / 60)}:
                  {elapsedTime % 60 < 10 ? `0${elapsedTime % 60}` : elapsedTime % 60}
                </div>
              </motion.div>
            )}

            {/* Butonlar */}
            <div className="flex flex-col gap-4 mt-auto">
              {videoStarted && !videoBlob && (
                <button
                  onClick={nextQuestion}
                  className="bg-gradient-to-br from-[#00A19D] to-[#007965] text-white px-4 py-2 rounded-lg hover:from-[#008f8f] hover:to-[#006d6d] transform hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Skip
                </button>
              )}

              {!videoBlob ? (
                <button
                  onClick={() => setVideoStarted(!videoStarted)}
                  className={`px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 ${videoStarted
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gradient-to-br from-[#004D61] to-[#007965] text-white hover:from-[#003843] hover:to-[#006d6d]'
                    }`}
                >
                  {videoStarted ? 'Stop Interview' : 'Start Interview'}
                </button>
              ) : (
                <button
                  onClick={() => uploadVideo(videoBlob)}
                  disabled={videoUploaded || isUploading}
                  className={`px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 ${videoUploaded
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isUploading
                      ? 'bg-blue-300 text-blue-600 cursor-wait'
                      : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                >
                  {videoUploaded ? 'Uploaded' : isUploading ? 'Uploading...' : 'Send Interview'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-bold text-green-500 mb-4">{successMessage}</h2>
          </div>
        </motion.div>
      )}

      {closeNotification && (
        <motion.div
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          The interview is over, you can now close the page.
        </motion.div>
      )}
    </div>
  );
};

export default InterviewPage;
