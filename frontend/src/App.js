import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Qna from './Webpages/Qna/Qna';
import StudyPlan from './Webpages/NewExplorer/StudyPlan';

function App() {
  const [selections, setSelections] = useState({});
  return (
    <Router>
      <div className="App">

        <Routes>
          
          {/* Student Routes*/}
          <Route path="/" element={<Qna />} />
          <Route path="/qna" element={<Qna />} />
          <Route path="/studyplan" element={<StudyPlan/>}/>
          
        </Routes>  
      </div>
    </Router>
  );
}

export default App;