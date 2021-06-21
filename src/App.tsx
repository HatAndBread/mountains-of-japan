import React from 'react';
import { useAppContext } from './index';

import './App.css';
import Header from './Pages/Header/Header';
function App() {
  const ctx = useAppContext();
  console.log(ctx);
  return (
    <div className='App'>
      <Header />
    </div>
  );
}

export default App;
