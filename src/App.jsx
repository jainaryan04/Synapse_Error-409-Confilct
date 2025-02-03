import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import WebcamPage from './components/Camera';
import FingerprintAuth from './components/Fingerprint';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/webcam" element={<WebcamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
