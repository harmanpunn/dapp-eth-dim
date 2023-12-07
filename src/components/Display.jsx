import React, { useState } from "react";
import axios from 'axios';

import { getArrayFromString } from "../utils/helper.js";
import networkInterface from "../utils/ipfs.js";
import Share from "./Share.jsx";

const Display = ({ contract, account, userHash }) => {
  const [data, setData] = useState([]);
  const [sharedData, setSharedData] = useState([]);
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
    try {

      const pinnedItems = await networkInterface.getFilesFromIPFSByCID(userHash);
      console.log('pinnedItems', pinnedItems);
     
      let filesArray = [];
      let sharedFilesArray = [];

      if (pinnedItems && pinnedItems.metadata.keyvalues && pinnedItems.metadata.keyvalues.files) {
        filesArray = getArrayFromString(pinnedItems.metadata.keyvalues.files);
      }  
      dataArray = filesArray;
      console.log('filesArray', filesArray);

      if (pinnedItems && pinnedItems.metadata.keyvalues && pinnedItems.metadata.keyvalues.shared_files) {
        sharedFilesArray = getArrayFromString(pinnedItems.metadata.keyvalues.shared_files);
      } 
      console.log('sharedFilesArray', sharedFilesArray);
      // dataArray = dataArray.concat(sharedFilesArray);

      // dataArray = otheraddress ? await contract.methods.display(otheraddress).call({from: account}) : await contract.methods.display(account).call({ from: account });
      console.log('dataArray', dataArray);

      
      if (sharedFilesArray && sharedFilesArray.length > 0) {
        setSharedData(sharedFilesArray);
        setError('');
      } else {
        setError("No image to display");
      }

    } catch (e) {
      console.log(e);
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
         
          <div className=" d-flex w-100 justify-content-center">
            <div><button className="btn btn-primary" onClick={getdata}>
              Get Data
            </button></div>
            
            <Share contract={contract} account={account} selectedFiles={selectedFiles} userHash={userHash} />
          </div>
        </div>
        


        {error && <div className="alert alert-danger" role="alert">
          {error}
        </div>}

        {data.length > 0 && (
          <React.Fragment>  
          <h3 className="mt-5">Your Files</h3>
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
          </React.Fragment>  
        )}

        
        {sharedData.length > 0 && (
          <React.Fragment>
          <h3 className="mt-5">Shared Files</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image URL</th>
                <th scope="col">Preview</th>
              </tr>
            </thead>
            <tbody>
              {sharedData.map((item, index) => (
                <tr key={index}>
                  
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
          </React.Fragment>
        )}

      </div>
    </>
  );
};

export default Display;
