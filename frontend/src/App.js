import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import InstructionPage from './pages/InstructionPage';
import LandingPage from './pages/LandingPage';
import NavSection from './pages/NavBarSection/Navbar';
import AssessmentCrud from './pages/CrudOpertations/AssessmentCrud';
import CreateAssessment from './pages/CrudOpertations/CreateAssessment';
import UpdateAssessment from './pages/CrudOpertations/UpdateAssessment';
import Reports from './pages/Reports/Reports';
import AssessmentPage from './pages/CrudOpertations/AssessmentPage';
import SignupPage from './pages/LoginAndSignup/SignupPage';
import LoginPage from './pages/LoginAndSignup/LoginPage';
import ResultMain from './pages/Results/ResultMain';
import ViewExams from './pages/Results/ViewExams';
import Answers from './pages/Results/Answers';
import Admin from './pages/LoginAndSignup/Admin';
import AdminSignup from './pages/LoginAndSignup/AdminSignup';


function App() {



  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<><NavSection /><LandingPage /></>} />
          <Route path="/instructions" element={<><NavSection /><InstructionPage /></>} />
          <Route path="/assessment" element={<><NavSection /><AssessmentCrud /></>} />
          <Route path="/take-assessment" element={<><NavSection /><AssessmentPage /></>} />
          <Route path='/create' element={<><NavSection /> <CreateAssessment /> </>} />
          <Route path='/update/:id' element={<><NavSection /> <UpdateAssessment /></>} />
          <Route path='/reports' element={<><NavSection /> <Reports /> </>} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/adminsignup' element={<AdminSignup />} />
          <Route path='/results' element={<><NavSection /><ResultMain /> </>} />
          <Route path='/view-exams/:email' element={<><NavSection /><ViewExams /> </>} />
          <Route path='/answers/:examName/:examCategory' element={<><NavSection /><Answers /> </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
