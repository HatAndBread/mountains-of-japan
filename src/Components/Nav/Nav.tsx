import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
  return (
    <nav className='Nav'>
      <Link to='/'>Home</Link>
    </nav>
  );
};

export default Nav;
