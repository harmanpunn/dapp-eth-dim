import React, { useState } from "react";
import {sha256} from "js-sha256";
import seedrandom  from "seedrandom";

import IPFSInterface from "../utils/ipfs";
import { aes } from "../lemon/encrypt";
import networkInterface from "../utils/ipfs";

import Cookies from "universal-cookie";
import { Token } from "../lemon/access_token";
import LemonLogin from "../lemon/Login";
import LemonRegister from "../lemon/Register";

const AuthComponent = ({identityContract, account , postLogin}) => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const JWT = process.env.REACT_APP_PINATA_JWT;

  return (
    <div className="container pt-5">
      <h2 className="my-4">Welcome to DAPP</h2>
      <div className="row mt-5">
        <div className="col-md-6">
          <h3>Login Here</h3>
          <LemonLogin identityContract={identityContract} account={account} networkInterface={networkInterface} postLogin={postLogin}/>
        </div>

        <div className="col-md-6">
          <h3>New User? Register Here</h3>
          <LemonRegister identityContract={identityContract} account={account} networkInterface={networkInterface}/>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
