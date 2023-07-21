import React from 'react';
import './App.css';
import Header from './components/Header';
import Quiz from './components/Quiz';
import ApiProvider from './data/ApiProvider';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ApiProvider>
      <ErrorBoundary>
        <Header />
        <Quiz />
      </ErrorBoundary>
    </ApiProvider>
  );
}

export default App;
