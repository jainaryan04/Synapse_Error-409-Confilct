import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import WebcamPage from './components/Camera';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './AuthContext';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/webcam"
          element={
            <ProtectedRoute>
              <WebcamPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
