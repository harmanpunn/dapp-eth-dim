import React, { useEffect, useState } from "react";

import UploadABI from "../abis/Upload.json";

import web3 from "../etherium/web3";
import FileUpload from "./FileUpload";
import Display from "./Display";
import Share from "./Share";

const UserProfile = ({ account }) => {
  const [userAccount, setUserAccount] = useState(account);
  const [uploadContract, setUploadContract] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      console.log("Inside UserProfile Componenent with account: ", account);

      const networkId = await web3.eth.net.getId();
      const uploadData = UploadABI.networks[networkId];
      if (uploadData) {
        const upload = new web3.eth.Contract(UploadABI.abi, uploadData.address);

        setUploadContract(upload);
      } else {
        window.alert("Upload contract not deployed to detected network.");
      }
    };

    loadData();
  }, []);

  return (
    <React.Fragment>
      <FileUpload account={userAccount} uploadContract={uploadContract} />
      <Share contract={uploadContract} account={userAccount}/>
      <Display contract={uploadContract} account={userAccount} />
      

    </React.Fragment>
  );
};

export default UserProfile;
