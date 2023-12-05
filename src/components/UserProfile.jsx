import React, { useEffect, useState } from "react";

import FileUpload from "./FileUpload";
import { isAuthenticated } from "../lemon/auth_service";
import { aes } from "../lemon/encrypt";
import networkInterface from "../utils/ipfs";

const UserProfile = ({ account, identityContract }) => {
  const [userHash, setUserHash] = useState("");
  useEffect(() => {
    isAuthenticated(identityContract, account).then(async (payload) => {
      const seed = payload["seed"];

      const coreCIDenc = await identityContract.methods
        .getUserCipher()
        .call({ from: account });
      const coreCID = aes.decryptText(coreCIDenc, seed, account);

      const root = await networkInterface.getFilesFromIPFSByCID(coreCID);

      setUserHash(root["metadata"]["keyvalues"]["auth"])
    });
  }, []);

  return (
    <React.Fragment>
      <FileUpload account={account} userHash={userHash}/>
    </React.Fragment>
  );
};

export default UserProfile;
