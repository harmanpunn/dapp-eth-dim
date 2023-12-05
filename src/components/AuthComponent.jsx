import React, { useState } from "react";
import {sha256} from "js-sha256";
import seedrandom  from "seedrandom";

import IPFSInterface from "../utils/ipfs";
import { aes } from "../utils/encrypt";
import networkInterface from "../utils/ipfs";

const AuthComponent = ({identityContract, account}) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSecret, setLoginSecret] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const JWT = process.env.REACT_APP_PINATA_JWT;

  
  const generateCustomHash = (email, password) => {
    // TODO: Can create a more complicated operation here
    return sha256(email + password);
  };

  const generateSecret = (coreHash) => {
    var rng = seedrandom(coreHash);
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const length = 10; // Specify the desired length of the secret

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(rng() * charactersLength));
    }
    return result;
  };

  const storeIdentity = async (name, email, hash) => {
    const user = {
      name: name,
      email: email,
      hash: hash,
    };
    const cid = await networkInterface.storeJSONinIPFS(user);
    return cid;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const seed = sha256(sha256(loginEmail + loginSecret) + account);
    const cipher = await identityContract.methods.getUserCipher().call({ from: account });

    const coreCID = aes.decryptText(cipher, seed, account);

    if(!coreCID || coreCID === '') {throw new Error("Invalid Credentials");}

    const root = await networkInterface.getFilesFromIPFSByCID(coreCID);
    if(generateCustomHash(loginEmail, loginPassword) === root["metadata"]["keyvalues"]["user_hash"]){
      console.log("Login Successful");
    }else{
      throw new Error("Invalid Credentials");
    }

    if (!identityContract) {
      console.log("identityContract not loaded", identityContract);
      return;
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const hash = generateCustomHash(registerEmail, registerPassword);
    
    if (!identityContract) {
        console.log('identityContract not loaded');
        return;
    }

    const coreHash = sha256(registerUsername + registerPassword + registerEmail + '' +(Date.now()) + account);
    const coreCID = await networkInterface.storeJSONinIPFS({"core":coreHash});
    console.log(`coreCID ${coreCID}`);
    const secret = generateSecret(coreHash);
    console.log(`secret ${secret}`);
    const seed = sha256(sha256(registerEmail + secret) + account);

    const cipher = aes.encryptText(coreCID, seed, account);

    try {
        await identityContract.methods.createIdentity(cipher).send({ from: account });
        const hash_id = await storeIdentity(registerUsername, registerEmail, hash);
        await networkInterface.updateMetadatainIPFS(coreCID, {"auth": hash_id,"user_hash": hash});
        console.log(`hash_id ${hash_id}`);
    } catch (error) {
        console.log('Error, createIdentity: ', error);
    }

    // Reset state (which also clears the form)
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterUsername('');
  };

  return (
    <div className="container pt-5">
      <h2 className="my-4">Welcome to DAPP</h2>
      <div className="row mt-5">
        <div className="col-md-6">
          <h3>Login Here</h3>
          <form id="loginForm" onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">
                Email address
              </label>
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
              <label htmlFor="loginPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="loginPassword"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="loginSecret" className="form-label">
                Secret
              </label>
              <input
                type="password"
                className="form-control"
                id="loginSecret"
                placeholder="Secret"
                value={loginSecret}
                onChange={(e) => setLoginSecret(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>

        <div className="col-md-6">
          <h3>New User? Register Here</h3>
          <form id="registerForm" onSubmit={handleRegisterSubmit}>
            <div className="mb-3">
              <label htmlFor="registerUsername" className="form-label">
                Username
              </label>
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
              <label htmlFor="registerEmail" className="form-label">
                Email address
              </label>
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
              <label htmlFor="registerPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="registerPassword"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
