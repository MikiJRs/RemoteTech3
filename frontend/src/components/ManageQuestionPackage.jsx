import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuestionPackageStore from '../stores/questionPackageStore';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ManageQuestionPackage = () => {
    const navigate = useNavigate();

    const { questionPackages, fetchPackages, deletePackage, updatePackage } = useQuestionPackageStore();

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

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
                    <h1 className="text-2xl font-semibold">Manage Question Package
                    </h1>
                    <div className="flex items-center">
                        <button
                            className="bg-[#004D61] text-white px-3 py-2 rounded-md hover:bg-[#003843] transition"
                            onClick={() => navigate('/login')}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-end items-center mb-8">
                        <button onClick={() => navigate('/manage-question-package/add-package')} className="bg-[#004D61] text-white px-4 py-2 rounded-md hover:bg-[#003843] transition">Add Package</button>
                    </div>




                    {/* Paket Listesi */}
                    <div className="bg-gray-100 p-6 rounded-lg mb-6 shadow-md overflow-y-auto max-h-[70vh]">
                        {questionPackages.length > 0 ? (
                            <>
                                <div className="grid grid-cols-4 gap-4 font-semibold text-gray-700 mb-4 border-b pb-2">
                                    <span>Order No</span>
                                    <span>Package Title</span>
                                    <span>Question</span>
                                    <span className="text-center">Action</span>
                                </div>
                                {questionPackages.map((pkg, index) => (
                                    <div
                                        key={pkg._id}
                                        className="grid grid-cols-4 gap-4 items-center bg-white p-4 mb-3 rounded-lg shadow-sm border"
                                    >
                                        <span className="font-medium text-gray-900">{index + 1}</span>
                                        <span className="text-gray-800">{pkg.packageName}</span>
                                        <span className="text-gray-800">{pkg.questions.length} questions</span>
                                        <div className="flex justify-center gap-3">
                                            <button
                                                className="bg-[#004D61] hover:bg-[#003843] text-white p-2 rounded transition-colors duration-200 flex items-center"
                                                onClick={() => {
                                                    console.log('Navigating to edit page with id:', pkg._id);
                                                    navigate(`/edit-package/${pkg._id}`);
                                                }}
                                            >
                                                <FaEdit className="w-4 h-4 mr-1" /> Edit
                                            </button>

                                            <button
                                                className="bg-[#004D61] hover:bg-[#003843] text-white p-2 rounded transition-colors duration-200 flex items-center"
                                                onClick={() => deletePackage(pkg._id)}
                                            >
                                                <FaTrashAlt className="w-4 h-4 mr-1" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-center p-10">
                                <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5 6v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2a2 2 0 012-2h10a2 2 0 012 2z" />
                                </svg>
                                <p className="text-gray-500 mt-4">No packages added yet. Start by creating one!</p>
                            </div>
                        )}
                    </div>





                </div>
            </motion.div>
        </div>
    );
};

export default ManageQuestionPackage;
