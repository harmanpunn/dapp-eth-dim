import React, { useState } from 'react';

const AuthComponent = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');


    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        console.log('Logging in:', loginEmail, loginPassword);
    }

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        console.log('Registering:', registerUsername, registerEmail, registerPassword);
    }

  return (
    <div className="container pt-5">
      <h2 className="my-4">Welcome to DAPP</h2>
      <div className="row mt-5">
        <div className="col-md-6">
          <h3>Login Here</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="loginEmail"
                placeholder="Enter email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="loginPassword"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>

        <div className="col-md-6">
          <h3>New User? Register Here</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="registerUsername" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="registerUsername"
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="registerEmail" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="registerEmail"
                placeholder="Enter email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="registerPassword" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="registerPassword"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
