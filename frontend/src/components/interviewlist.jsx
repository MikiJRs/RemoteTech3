import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionListModal from './QuestionList.jsx';
import useInterviewStore from '../stores/interviewStore'; // Store'u import ettik
import useQuestionPackageStore from '../stores/questionPackageStore'; // Paketleri çekmek için store'u import ettik
import axios from 'axios'; // Axios'u ekledik
import {FaLink, FaTrashAlt, FaCalendarAlt, FaEye } from 'react-icons/fa'; // İkonları ekledik
import { motion } from 'framer-motion';
  
const apiUrl = import.meta.env.VITE_BE_URL;
const apiUrl2 = import.meta.env.VITE_BE_URL2;


const InterviewList = () => {
  const navigate = useNavigate();
  const [modalGoster, setModalGoster] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedPackages, setSelectedPackages] = useState([]); // Birden fazla paket için dizi
  const [expireDate, setExpireDate] = useState(null);
  const [canSkip, setCanSkip] = useState(false);
  const [showAtOnce, setShowAtOnce] = useState(false);
  const [questionListOpen, setQuestionListOpen] = useState(false);
  const [currentInterviewId, setCurrentInterviewId] = useState(null); // Interview ID'yi tutmak için state ekledik
  const [extraQuestions, setExtraQuestions] = useState([]); // Seçilen ekstra soruların listesini tutacak state

  // Hata mesajları için state
  const [titleError, setTitleError] = useState('');
  const [packageError, setPackageError] = useState('');
  const [expireDateError, setExpireDateError] = useState('');

  // Zustand store'dan gerekli fonksiyonları ve verileri alıyoruz
  const { interviewList, fetchInterviews, deleteInterview } = useInterviewStore();
  const { questionPackages, fetchPackages } = useQuestionPackageStore(); // Paketleri çekmek için gerekli fonksiyonlar

  useEffect(() => {
    // Component yüklendiğinde mülakat listesini getir
    fetchInterviews();
    // Component yüklendiğinde paket listesini getir
    fetchPackages();
  }, [fetchInterviews, fetchPackages]);

  const handleAddExtraQuestion = async (newExtraQuestion) => {
    // Yeni ekstra soruyu mevcut listeye ekleyerek güncelliyoruz
    const updatedExtraQuestions = [...extraQuestions, newExtraQuestion];
    setExtraQuestions(updatedExtraQuestions);

    // Yalnızca ekstra olarak eklenmiş soruları filtreliyoruz (orneğin, `_id` olmayanlar)
    const filteredExtraQuestions = updatedExtraQuestions.filter(q => !q._id);

    try {
      // Sadece filtrelenmiş ekstra soruları sunucuya gönderiyoruz
      await axios.put(`${apiUrl}/interviews/${currentInterviewId}`, {
        extraQuestions: filteredExtraQuestions.map((q) => ({
          questionText: q.questionText,
          time: q.question_time?.minutes || 0, // `minutes` değeri yoksa 0 olarak ayarla
        })),
      });
      console.log('Extra questions updated successfully');
    } catch (error) {
      console.error('Failed to update extra questions:', error);
    }
  };

  const handleSoruEkle = () => {
    setModalGoster(true);
  };

  const resetForm = () => {
    setTitle('');
    setSelectedPackages([]);
    setExpireDate(null);
    setTitleError('');
    setPackageError('');
    setExpireDateError('');
  };

  const handleModalKapat = () => {
    resetForm(); // Form sıfırlama
    setModalGoster(false);
  };

  const handlePackageChange = (pkgId) => {
    // Eğer paket zaten seçildiyse çıkar, değilse ekle
    if (selectedPackages.includes(pkgId)) {
      setSelectedPackages(selectedPackages.filter(id => id !== pkgId));
    } else {
      setSelectedPackages([...selectedPackages, pkgId]);
    }
  };

  const handleFormSave = async () => {
    // Hata mesajlarını sıfırla
    setTitleError('');
    setPackageError('');
    setExpireDateError('');

    // Doğrulama
    let valid = true;

    if (title.trim() === '') {
      setTitleError('The title must be filled in');
      valid = false;
    }
    if (selectedPackages.length === 0) {
      setPackageError('At least one package must be selected');
      valid = false;
    }

    const today = new Date().toISOString().split("T")[0]; // Güncel tarihi 'YYYY-MM-DD' formatında alıyoruz

    if (!expireDate) {
      setExpireDateError('Expire Date must be filled in');
      valid = false;
    } else if (expireDate < today) {
      setExpireDateError('Expire Date cannot be earlier than today');
      valid = false;
    }

    if (!valid) return; // Eğer form geçersizse gönderimi durdur

    const newInterview = {
      interviewTitle: title,
      expireDate: expireDate,
      packageIds: selectedPackages.map(packageId => ({ packageId })),
    };

    try {
      // Axios ile POST isteği yap
      const response = await axios.post(`${apiUrl}/interviews`, newInterview, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Interview created successfully:', response.data);

      // Başarıyla oluşturulursa modalı kapat ve formu temizle
      resetForm();
      setModalGoster(false);

      // Yeni listeyi getir
      fetchInterviews();
    } catch (error) {
      console.error('Failed to create interview:', error.response ? error.response.data : error.message);
    }
  };

  const handleInterviewDelete = (id) => {
    // Mülakatı zustand üzerinden siliyoruz
    deleteInterview(id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Tarihi daha okunabilir formatta göster
  };

  const handleShowQuestions = (interview) => {
    // Paketlerdeki tüm soruları topla
    const packageQuestions = interview.packageIds.flatMap(pkg => {
      const selectedPackage = questionPackages.find(questionPackage => questionPackage._id === pkg.packageId);
      return selectedPackage ? selectedPackage.questions : [];
    });

    interview.extraQuestions.map((question) => {
      console.log("ppp :" + question.questionText)
    })
    console.log("mülakat baba: " + interview)
    console.log("interview list: " + interviewList)

    // Ekstra soruları da dahil et
    const allQuestions = [
      ...packageQuestions,
      ...interview.extraQuestions.map((extraQuestion) => ({
        questionText: extraQuestion.questionText,
        question_time: { minutes: extraQuestion.time }
      }))
    ];

    // Yinelenen soruları filtrele (orneğin, questionText özelliğine göre)
    const uniqueQuestions = Array.from(new Set(allQuestions.map(q => q.questionText)))
      .map(questionText => {
        return allQuestions.find(q => q.questionText === questionText);
      });

    setCurrentInterviewId(interview._id); // Mülakat ID'sini kaydediyoruz
    setExtraQuestions(uniqueQuestions); // Yinelenenleri kaldırarak güncel soruları kaydediyoruz
    setQuestionListOpen(true);
  };

  const handleCopyLink = (interviewId) => {
    const interviewLink = `${apiUrl2}/user-login?interviewId=${interviewId}`;
    navigator.clipboard.writeText(interviewLink)
      .then(() => {
        console.log('Link başarıyla kopyalandı:', interviewLink);
      })
      .catch((error) => {
        console.error('Link kopyalanamadı:', error);
      });
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
      <motion.div
        className="absolute right-0 w-[80%] h-full bg-[#F9F9F9] z-10 rounded-l-[40px] overflow-hidden shadow-lg p-8"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'tween', duration: 0.4 }}
      >
        {/* Üst kısım - Remote-tech Admin Page ve Çıkış Butonu */}
        <div className="flex justify-between items-center p-3 border-b border-gray-300">
          <h1 className="text-2xl font-semibold text-[#002D3A]">Interview List</h1>
          <div className="flex items-center">
            <button
              className="bg-[#004D61] text-white px-3 py-2 rounded-md hover:bg-[#003843] transition"
              onClick={() => navigate('/login')}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex justify-end items-center px-8 py-4">
          <button onClick={handleSoruEkle} className="bg-[#004D61] text-white px-4 py-2 rounded-md hover:bg-[#003843] transition">
            Create Interview
          </button>
        </div>

        {/* Mülakat Listesi */}
        <div className="px-8 py-4">
          {interviewList.length > 0 ? (
            <ul className="grid grid-cols-3 gap-6">
              {interviewList.map((interview, index) => {
                const selectedPackageNames = interview.packageIds.map(pkg => {
                  const selectedPackage = questionPackages.find(questionPackage => questionPackage._id === pkg.packageId);
                  return selectedPackage ? selectedPackage.packageName : 'Unknown Package';
                });

                return (
                  <li
                    key={interview._id}
                    className="p-6 border rounded bg-white shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition-all duration-300 relative"
                    style={{ minHeight: '280px' }}>
                    <button
                      className="text-[#004D61] hover:text-[#003843] flex items-center transition-all"
                      onClick={() => handleShowQuestions(interview)}
                    >
                      <FaEye className="mr-1 w-4 h-4" /> View
                    </button>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold mt-4">{interview.interviewTitle}</h3>
                      <div className="text-gray-500">
                        <button
                          className="bg-[#004D61] text-white text-sm px-3 py-1.5 rounded-lg hover:bg-[#003843] flex items-center transition-all"
                          onClick={() => handleInterviewDelete(interview._id)}
                        >
                          <FaTrashAlt className="mr-1 w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="border p-2 rounded bg-gray-100 mb-4">
                      <h4 className="text-sm font-semibold mb-2">Selected Packages:</h4>
                      <ul>
                        {selectedPackageNames.length > 0 ? (
                          selectedPackageNames.map((packageName, index) => (
                            <li key={index} className="text-sm">
                              {packageName}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500">No packages selected</li>
                        )}
                      </ul>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2 w-4 h-4" />
                      <span>To be published until {formatDate(interview.expireDate)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <button
                        className="bg-gray-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-700 flex items-center transition-all"
                        onClick={() => handleCopyLink(interview._id)}
                      >
                        <FaLink className="mr-1 w-4 h-4" /> Copy Link
                      </button>
                      <button
                        className="bg-[#004D61] text-white text-sm px-3 py-1.5 rounded-lg hover:bg-[#003843] flex items-center transition-all"
                        onClick={() => navigate(`/videocollection/${interview._id}`)}
                      >
                        See Videos
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center p-10">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5 6v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              <p className="text-gray-500 mt-4">No interviews added yet. Start by creating one!</p>
            </div>
          )}
        </div>

        {/* Question List Modali */}
        <QuestionListModal
          isOpen={questionListOpen}
          onClose={() => setQuestionListOpen(false)}
          questions={extraQuestions}
          onAddExtraQuestion={handleAddExtraQuestion}
        />





        {/* Mülakat Ekleme Modali */}
        {modalGoster && (
  <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${modalGoster ? 'opacity-100' : 'opacity-0'}`}>
    <div className="bg-white p-8 rounded-lg shadow-lg transform transition-transform scale-100 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Create Interview</h2>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Title</label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Input..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {titleError && (
          <div className="flex items-center bg-red-100 text-red-600 p-2 rounded mt-2">
            <span className="mr-2"></span> {titleError}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Select Packages</label>
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-gray-300 p-4 rounded-md">
          {questionPackages.map((pkg) => (
            <div key={pkg._id} className="flex items-center">
              <input type="checkbox" className="appearance-none rounded-full w-4 h-4 border border-gray-400 checked:bg-blue-500 checked:border-transparent focus:outline-none"
                id={pkg._id}
                value={pkg._id}
                checked={selectedPackages.includes(pkg._id)}
                onChange={() => handlePackageChange(pkg._id)}
              />
              <label htmlFor={pkg._id} className="ml-2">{pkg.packageName}</label>
            </div>
          ))}
        </div>
        {packageError && (
          <div className="flex items-center bg-red-100 text-red-600 p-2 rounded mt-2">
            <span className="mr-2"></span> {packageError}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Expire Date</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={expireDate || ''}
          onChange={(e) => setExpireDate(e.target.value)}
        />
        {expireDateError && (
          <div className="flex items-center bg-red-100 text-red-600 p-2 rounded mt-2">
            <span className="mr-2"></span> {expireDateError}
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button
          className="bg-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-500 transition"
          onClick={handleModalKapat}>
          Cancel
        </button>
        <button
          className="bg-[#004D61] text-white px-4 py-2 rounded-md hover:bg-[#003843] transition"
          onClick={handleFormSave}>
          Save Interview
        </button>
      </div>
    </div>
  </div>
)}








      </motion.div>
    </div>
  );
};

export default InterviewList;