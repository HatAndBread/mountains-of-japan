import React from 'react';
import { useAppContext } from './index';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Nav from './Components/Nav/Nav';
import Header from './Pages/Header/Header';
import Mountains from './Pages/Mountains/Mountains';
import Mountain from './Pages/Mountain/Mountain';
import MainMap from './Components/MainMap/MainMap';

function App() {
  const ctx = useAppContext();
  console.log(ctx);
  return (
    <Router>
      <div className='App'>
        <Nav />
        <Header />
      </div>
      <Switch>
        <Route path='/' exact>
          <MainMap />
        </Route>
        <Route path='/mountains/:id' exact>
          <Mountain />
        </Route>
        <Route path='/mountains' exact>
          <Mountains />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
