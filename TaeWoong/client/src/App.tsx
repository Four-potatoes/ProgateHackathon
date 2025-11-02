import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';

// Pages
import WelcomePage from './pages/WelcomePage';
import StagesPage from './pages/StagesPage';
import GamePage from './pages/GamePage';
import CollectionPage from './pages/CollectionPage';
import QuizPage from './pages/QuizPage';
import ShopPage from './pages/ShopPage';
import RankingPage from './pages/RankingPage';
import AchievementPage from './pages/AchievementPage';
import CultureWikiPage from './pages/CultureWikiPage';
import MainPage from './pages/MainPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/stages" element={<StagesPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/collection" element={<CollectionPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/achievements" element={<AchievementPage />} />
      <Route path="/wiki" element={<CultureWikiPage />} />
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