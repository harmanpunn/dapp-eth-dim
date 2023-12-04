import React, { useState } from "react";
import axios from 'axios';
import {sha256} from "js-sha256";

const AuthComponent = ({identityContract, account}) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const JWT =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjYmUwZDI1Zi02YmM5LTRjMmQtYWNhYS05NjllNTA0ZTMzNTciLCJlbWFpbCI6Imhhcm1hbnB1bm4yMjEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmYjY3MjVlZGQ5NzU4ZGY0YWE4ZiIsInNjb3BlZEtleVNlY3JldCI6IjQzZDhkNTQzZjU4N2U3M2ZkZmUzZjJhOTgxOGVlNzA4YjVhOTA2M2NiMzlhYmI4MzExYTZmMzRmMmExNGYxMGEiLCJpYXQiOjE3MDE2MzU0ODl9.wvKa60SEMXLreQqrpLSozGD6DqQtwVPlHSTtGfXqmds";

  const generateCustomHash = (email, password) => {
    // TODO: Can create a more complicated operation here
    return sha256(email + password);
  };

  const storeIdentity = async (name, email, hash) => {
    const user = {
      name: name,
      email: email,
      hash: hash,
    };

    const userObj = JSON.stringify(user);
    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: userObj,
      headers: {
        "Content-Type": `application/json`,
        Authorization: JWT,
      },
    });

    const cid = resFile.data.IpfsHash;
    console.log(`User stored with CID ${cid}`);

    // const obj = await cat(cid);
    // console.log(`User retrieved from CID ${obj}`);

    console.log(
      `Preview url ${`https://yellow-tiny-meadowlark-314.mypinata.cloud/ipfs/${cid}`}`
    );

    return cid;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    console.log("Logging in:", loginEmail, loginPassword);
    const hash = generateCustomHash(loginEmail, loginPassword);

    if (!identityContract) {
      console.log("identityContract not loaded", identityContract);
      return;
    }

    console.log(await identityContract.methods.validateIdentity(hash).call({ from: account }));
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    console.log(
      "Registering:",
      registerUsername,
      registerEmail,
      registerPassword
    );

    const hash = generateCustomHash(registerEmail, registerPassword);
    
    if (!identityContract) {
        console.log('identityContract not loaded', identityContract);
        return;
    }

    try {
        const hash_id = await storeIdentity(registerUsername, registerEmail, hash);
        console.log(`hash_id ${hash_id}`);

        await identityContract.methods.createIdentity(hash, hash_id).send({ from: account });
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
