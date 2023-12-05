import React, { useState } from "react";
import { sha256 } from "js-sha256";
import { aes } from "./encrypt";

import Cookies from "universal-cookie";
import { Token } from "./access_token";
import { generateCustomHash } from "./utils";

const LemonLogin = ({ identityContract, account, networkInterface , postLogin}) => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginSecret, setLoginSecret] = useState("");

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const cookies = new Cookies();
        const seed = sha256(sha256(loginEmail + loginSecret) + account);
        const cipher = await identityContract.methods.getUserCipher().call({ from: account });
    
        const coreCID = aes.decryptText(cipher, seed, account);
    
        if(!coreCID || coreCID === '') {throw new Error("Invalid Credentials");}
    
        const root = await networkInterface.getFilesFromIPFSByCID(coreCID);
        if(generateCustomHash(loginEmail, loginPassword) === root["metadata"]["keyvalues"]["user_hash"]){
          cookies.set("access_token", Token.generateToken({"seed" : seed}, cipher, account, 30*60*1000), { path: "/" });
          console.log("Login Successful! Token issued!");
          postLogin();
        }else{
          throw new Error("Invalid Credentials");
        }
    
        if (!identityContract) {
          console.log("identityContract not loaded", identityContract);
          return;
        }
      };

    return (
        <div className="row">
            <form onSubmit={handleLoginSubmit}>
                <div className="col mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                    />
                </div>
                <div className="col mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                </div>
                <div className="col mb-4">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Secret"
                        value={loginSecret}
                        onChange={(e) => setLoginSecret(e.target.value)}
                    />
                </div>
                <div className="w-100 d-flex align-items-center justify-content-center">
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    );
};

export default LemonLogin;