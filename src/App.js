import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidebarNav from './components/Home/SidebarNav';
import Form from './components/Form';
import { ShortcutProvider } from './components/context/ShortcutContext';
import './App.css';

function App() {
  return (
    <Router>
      <ShortcutProvider>
        <div className="App">
          <div className="main-container" style={{ display: "flex" }}>
            <div className="sidebar" style={{ width: "15%" }}>
              <SidebarNav />
            </div>
            <div className="form-container" style={{ width: "80%" }}>
              <Routes>
                <Route path="/" element={<Form />} />
              </Routes>
            </div>
          </div>
        </div>
      </ShortcutProvider>
    </Router>
  );
}

export default App;
