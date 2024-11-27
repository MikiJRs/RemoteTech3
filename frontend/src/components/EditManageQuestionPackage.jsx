import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useQuestionPackageStore from '../stores/questionPackageStore';
import { FaTrashAlt } from 'react-icons/fa'; // Silme ikonu için react-icons'dan FaTrashAlt ekledik

const EditManageQuestionPackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { questionPackages, updatePackage } = useQuestionPackageStore();

    // Local state for form data
    const [packageData, setPackageData] = useState({
        packageName: '',
        questions: [],
    });

    // useEffect to fetch the selected package data when the component mounts
    useEffect(() => {
        const selectedPackage = questionPackages.find(pkg => pkg._id === id);
        if (selectedPackage) {
            setPackageData({
                packageName: selectedPackage.packageName,
                questions: selectedPackage.questions,
            });
        }
    }, [id, questionPackages]);

    // Handle input changes for package name
    const handleInputChange = (e) => {
        setPackageData({
            ...packageData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle questions update (could be enhanced later to allow full CRUD on questions)
    const handleQuestionsChange = (e, index) => {
        const updatedQuestions = [...packageData.questions];
        updatedQuestions[index].questionText = e.target.value; // Burada questionText özelliği güncelleniyor
        setPackageData({
            ...packageData,
            questions: updatedQuestions,
        });
    };

    // Handle form submission to update the package
    const handleSubmit = (e) => {
        e.preventDefault();
        updatePackage(id, packageData);
        navigate('/manage-question-package'); // Navigate back after update
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
                    <h1 className="text-2xl font-semibold">Edit Question Package</h1>
                    <div className="flex items-center">
                        <button
                            className="bg-[#004D61] text-white px-3 py-2 rounded-md hover:bg-[#003843] transition"
                            onClick={() => navigate('/login')}
                        >
                            Logout
                        </button>
                    </div>
                </div>



                {/* Form düzenleme kısmı */}
                <div className="mt-8">
                    <div className="flex justify-end items-center mb-8">
                        <button
                            type="button"
                            className="bg-[#004D61] text-white px-4 py-2 rounded-md hover:bg-[#003843] transition"
                            onClick={() => {
                                setPackageData((prevData) => ({
                                    ...prevData,
                                    questions: [...prevData.questions, { questionText: '' }]
                                }));
                            }}
                        >
                            Add Question
                        </button>
                    </div>

                    <div className="bg-gray-100 p-6 rounded-lg mb-6 shadow-md overflow-y-auto max-h-[70vh]">
                        <form onSubmit={handleSubmit}>
                            <label className="grid grid-cols-4 gap-4 font-semibold text-gray-700 mb-4 border-b pb-2" htmlFor="packageName">
                                Package Title
                            </label>

                            <input
                                type="text"
                                id="packageName"
                                name="packageName"
                                value={packageData.packageName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                                required
                            />

                            <div className="mb-4">
                                <label className="grid grid-cols-4 gap-4 font-semibold text-gray-700 mb-4 border-b pb-2">
                                    Questions
                                </label>
                                {packageData.questions.map((question, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={question.questionText} // Sadece questionText özelliğini gösteriyoruz
                                            onChange={(e) => handleQuestionsChange(e, index)}
                                            className="flex-grow px-3 py-2 border border-gray-300 rounded mr-2"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="bg-[#004D61] hover:bg-[#003843] text-white p-2 rounded transition-colors duration-200 flex items-center"
                                            onClick={() => {
                                                const updatedQuestions = packageData.questions.filter((_, i) => i !== index);
                                                setPackageData({ ...packageData, questions: updatedQuestions });
                                            }}
                                        >
                                            <FaTrashAlt className="w-4 h-4 mr-1" /> Delete
                                        </button>
                                    </div>
                                ))}

                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                                    onClick={() => navigate('/manage-question-package')}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#004D61] text-white px-4 py-2 rounded hover:bg-[#003843] transition"
                                >
                                    Update Package
                                </button>
                            </div>
                        </form>
                    </div>
                </div>



            </div>
        </div>
    );
};

export default EditManageQuestionPackage;
