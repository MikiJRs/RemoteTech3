import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './components/UserLogin';
import InterviewPage from './components/InterviewPage';

const App = () => {
  return (
    <Router>
      {/* StrictMode dışında tanımlanan UserLogin rotası */}
      <Routes>
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/interview/:interviewId" element={<InterviewPage />} /> {/* Dinamik rota eklendi */}
      </Routes>

      {/* StrictMode içinde diğer rotalar */}
      <React.StrictMode>
        <Routes>
          <Route path="/" element={<UserLogin />} />
          <Route path="/interviewpage" element={<InterviewPage />} />
        </Routes>
      </React.StrictMode>
    </Router>
  );
};

export default App;
