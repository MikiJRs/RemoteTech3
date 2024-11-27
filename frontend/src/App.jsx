import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ManageQuestionPackage from './components/ManageQuestionPackage';
import AddPackage from './components/AddPackage';
import InterviewList from './components/interviewlist';
import VideoCollection from './components/VideoCollection';
import QuestionList from './components/QuestionList.jsx';
import EditManageQuestionPackage from './components/EditManageQuestionPackage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login sayfası için route */}
        <Route path="/login" element={<Login />} />

        {/* ManageQuestionPackage bileşeni için route */}
        <Route path="/manage-question-package" element={<ManageQuestionPackage />} />

        {/* Paket Ekleme Sayfası */}
        <Route path="/manage-question-package/add-package" element={<AddPackage />} />

        {/* Paket Düzenleme Sayfası */}
        <Route path="/edit-package/:id" element={<EditManageQuestionPackage />} />

        {/* InterviewList bileşeni için route */}
        <Route path="/interviewlist" element={<InterviewList />} />

        <Route path="/videocollection/:interviewId" element={<VideoCollection />} />

        
        <Route path="/questionlist" element={<QuestionList/>}/>

        {/* Root path (/) kullanıldığında otomatik olarak /login sayfasına yönlendirme */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
