import React from 'react';
// import { Link } from 'react-router-dom'; // Uncomment if using React Router

const Navbar = ({account}) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <span className="navbar-brand col-sm-3 col-md-2 mr-0">Lemon.auth</span>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small>
            <a className="nav-link" href="#">
              <span id="account">{account}</span>
            </a>
          </small>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
