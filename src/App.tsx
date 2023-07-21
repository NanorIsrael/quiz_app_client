import React from 'react';
import './App.css';
import Quiz from './components/Quiz';
import ApiProvider from './data/ApiProvider';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ApiProvider>
              <ErrorBoundary>
                <Quiz/>
              </ErrorBoundary>
    </ApiProvider>
  );
}

export default App;
