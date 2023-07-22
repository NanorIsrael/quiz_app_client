import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Quiz from './components/Quiz';
import ScoreBoard from './components/ScoreBoard';
import ApiProvider from './data/ApiProvider';
import UserProvider from './data/UserProvider';
import ErrorBoundary from './ErrorBoundary';
import LoginPage from './Pages/LoginPage';
import RegistrationPageWithFlash from './Pages/SignupPage';

function App() {
  const [score, setScore] = useState(0);
  return (
    <ApiProvider>
      <UserProvider>
        <ErrorBoundary>
          <Header />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <RegistrationPageWithFlash />
                </PublicRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Routes>
                    <Route path="/" element={<Quiz setScore={setScore} />} />

                    <Route
                      path="/user/score"
                      element={<ScoreBoard score={score} />}
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </PrivateRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </UserProvider>
    </ApiProvider>
  );
}

export default App;
