import React, { useState } from "react";
import axios from 'axios';

import { getArrayFromString } from "../utils/helper.js";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const userHash = 'QmSt6yTT9HypY62vXC2KrQpX3CPWxg9YQn1G6M1FDiFV3p'
  const JWT = process.env.REACT_APP_PINATA_JWT;



  const getdata = async () => {
    console.log(account)
    let dataArray;
    const otheraddress = document.querySelector(".address-input").value;
    try {
      const resFile = await axios({
        method: "get",
        url: `https://api.pinata.cloud/data/pinList?hashContains=${userHash}`,
        headers: {
          "Content-Type": `application/json`,
          Authorization: JWT,
        },
      });

      const pinnedItems = resFile.data.rows;
      let filesArray = [];

      if (pinnedItems.length > 0 && pinnedItems[0].metadata.keyvalues.files) {
        filesArray = getArrayFromString(pinnedItems[0].metadata.keyvalues.files);
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
                <th scope="col">#</th>
                <th scope="col">Image URL</th>
                <th scope="col">Preview</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
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
        )}
      </div>
    </>
  );
};

export default Display;
