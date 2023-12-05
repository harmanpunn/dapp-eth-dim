import React, { useState } from "react";
import seedrandom from "seedrandom";
import { generateCustomHash } from "./utils";
import { sha256 } from "js-sha256";
import { aes } from "./encrypt";

const LemonRegister = ({ identityContract, account, networkInterface }) => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const generateSecret = (coreHash) => {
    var rng = seedrandom(coreHash);
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const hash = generateCustomHash(registerEmail, registerPassword);

    if (!identityContract) {
      console.log("identityContract not loaded");
      return;
    }

    const coreHash = sha256(
        registerUsername +
        registerPassword +
        registerEmail +
        "" +
        Date.now() +
        account
    );
    const coreCID = await networkInterface.storeJSONinIPFS({ core: coreHash });
    console.log(`coreCID ${coreCID}`);
    const secret = generateSecret(coreHash);
    console.log(`secret ${secret}`);
    const seed = sha256(sha256(registerEmail + secret) + account);

    const cipher = aes.encryptText(coreCID, seed, account);

    try {
      await identityContract.methods
        .createIdentity(cipher)
        .send({ from: account });
      const hash_id = await storeIdentity(
        registerUsername,
        registerEmail,
        hash
      );
      await networkInterface.updateMetadatainIPFS(coreCID, {
        auth: hash_id,
        user_hash: hash,
      });
      console.log(`hash_id ${hash_id}`);
    } catch (error) {
      console.log("Error, createIdentity: ", error);
    }

    // Reset state (which also clears the form)
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterUsername("");
  };

  return (
    <div className="row">
      <form onSubmit={handleRegisterSubmit}>
        <div className="col mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
        </div>
        <div className="col mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
        </div>
        <div className="col mb-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
        </div>
        <div className="w-100 d-flex align-items-center justify-content-center">
            <button type="submit" className="btn btn-success">Register</button>
        </div>
      </form>
    </div>
  );
};

export default LemonRegister;
