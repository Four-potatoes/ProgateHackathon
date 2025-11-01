import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';

// Pages
import WelcomePage from './pages/WelcomePage';
import StagesPage from './pages/StagesPage';
import GamePage from './pages/GamePage';
import CollectionPage from './pages/CollectionPage';
import QuizPage from './pages/QuizPage';
import ShopPage from './pages/ShopPage';
import RankingPage from './pages/RankingPage';

// Protected Route 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/stages" element={<StagesPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/collection" element={<CollectionPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;