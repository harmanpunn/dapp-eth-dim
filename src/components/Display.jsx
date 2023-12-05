import React, { useState } from "react";
import axios from 'axios';

import { getArrayFromString } from "../utils/helper.js";
import networkInterface from "../utils/ipfs.js";
import Share from "./Share.jsx";

const Display = ({ contract, account, userHash }) => {
  const [data, setData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [error, setError] = useState('');
  const JWT = process.env.REACT_APP_PINATA_JWT;

  const toggleFileSelection = (hash) => {
      setSelectedFiles(prev => ({
          ...prev,
          [hash]: !prev[hash]
      }));
  };

  const getdata = async () => {
    console.log(account)
    let dataArray;
    const otheraddress = document.querySelector(".address-input").value;
    try {

      const pinnedItems = await networkInterface.getFilesFromIPFSByCID(userHash);
     
      let filesArray = [];

      if (pinnedItems && pinnedItems.metadata.keyvalues.files) {
        filesArray = getArrayFromString(pinnedItems.metadata.keyvalues.files);
      }  
      dataArray = filesArray;

      // dataArray = otheraddress ? await contract.methods.display(otheraddress).call({from: account}) : await contract.methods.display(account).call({ from: account });
      console.log('dataArray', dataArray);
      window.dataArray = dataArray;
    } catch (e) {
      setError("You don't have access");
      return;
    }
    if (dataArray && dataArray.length > 0) {
      setData(dataArray);
      setError('');
    } else {
      setError("No image to display");
    }
  };

  return (
    <>
      <div className="container my-4">
        <div className="input-group mb-3">
          <input
            type="text"
            placeholder="Enter Address"
            className="form-control address-input"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" onClick={getdata}>
              Get Data
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger" role="alert">
          {error}
        </div>}

        {data.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Select</th>
                <th scope="col">#</th>
                <th scope="col">Image URL</th>
                <th scope="col">Preview</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  
                  <td>
                      <input
                          type="checkbox"
                          checked={selectedFiles[item] || false}
                          onChange={() => toggleFileSelection(item)}
                      />
                  </td>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <a href={`https://yellow-tiny-meadowlark-314.mypinata.cloud/ipfs/${item}`} target="_blank" rel="noopener noreferrer">
                    {`https://yellow-tiny-meadowlark-314.mypinata.cloud/ipfs/${item}`}
                    </a>
                  </td>
                  <td>
                    <a href={`https://yellow-tiny-meadowlark-314.mypinata.cloud/ipfs/${item}`} target="_blank" rel="noopener noreferrer">
                      <img src={`https://yellow-tiny-meadowlark-314.mypinata.cloud/ipfs/${item}`} alt={`Item ${index}`} className="image-preview" width="100" height="100"/>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Share contract={contract} account={account} selectedFiles={selectedFiles} userHash={userHash} />

      </div>
    </>
  );
};

export default Display;
