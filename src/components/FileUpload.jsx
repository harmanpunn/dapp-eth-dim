import React, { useState } from "react";
import axios from 'axios';
import keccak256 from "keccak256";

import { generateMerkleTree, getMerkleRoot, getMerkleProof } from "../utils/merkelUtils";
import { getArrayFromString, numStringToBytes32 } from "../utils/helper.js";

const FileUpload = ({ account, uploadContract }) => {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image selected");
    const JWT = process.env.REACT_APP_PINATA_JWT;
    const userHash = 'QmSt6yTT9HypY62vXC2KrQpX3CPWxg9YQn1G6M1FDiFV3p'
    window.hello = 'hello';

    /// Expose the functions to window object
    window.generateMerkleTree = generateMerkleTree;
    window.getMerkleRoot = getMerkleRoot;
    window.getMerkleProof = getMerkleProof;
    
    const storeHashOffChain = async (hash) => {
      const jsonBody = {
        hash: hash,
      };

      const jsonBodyString = JSON.stringify(jsonBody);

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

        filesArray.push(hash);

        // remove duplicates
        filesArray = [...new Set(filesArray)];

        const updatedMetadata = {
            files: filesArray.toString(),
        };
      
        const json_string = JSON.stringify({keyvalues: updatedMetadata, ipfsPinHash: userHash});

        // Updating user metadata 
        await axios({
          method: "put",
          url: "https://api.pinata.cloud/pinning/hashMetadata",
          data: json_string,
          headers: {
            accept: 'application/json',
            "Content-Type": `application/json`,
            Authorization: JWT,
          },
        });

        return filesArray;
      } catch (error) {
        console.error("Error updating metadata", error);
      }

      // try {
      //   const res = await axios({
      //     method: "post",
      //     url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      //     data: jsonBodyString,
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: JWT,
      //     },
      //   });
      //   console.log("Hash stored off-chain", res.data);

      //   return res.data.IpfsHash;
      // } catch (error) {
      //   console.error("Error storing hash off-chain", error);
      // }
      
    }

    const getAllStoredHashes = async (account) => {

      try {
        const resp = await axios({
          method: "get",
          url: `https://api.pinata.cloud/data/pinList?hashContains=${userHash}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: JWT,
          },
        });

        const pinnedItems = resp.data.rows;
        let filesArray = [];
        if (pinnedItems.length > 0 && pinnedItems[0].metadata.keyvalues.files) {
          filesArray = getArrayFromString(pinnedItems[0].metadata.keyvalues.files);
        }
        console.log('getAllStoredHashes {} filesArray len', filesArray.length);
        return filesArray;

      } catch (error) {
        console.error("Error retrieving hashes", error);
      }

    }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(file) {
        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    "Content-Type": `multipart/form-data`,
                    Authorization: JWT,
                },
            });

            const cid = resFile.data.IpfsHash;

            const offChainHashFilesArray = await storeHashOffChain(cid);

            // const hashes = await getAllStoredHashes(account);
            const hashes = offChainHashFilesArray;
            const testHash = hashes[1];
            const index_2 = hashes.indexOf(testHash);
            const testHash256 = "0x" + Array.from(keccak256(testHash)).map(byte => byte.toString(16).padStart(2, '0')).join('');

            const merkleTree = generateMerkleTree(hashes);
            const merkleRoot = getMerkleRoot(merkleTree); 

            const proof = getMerkleProof(merkleTree, testHash);

            await uploadContract.methods.storeMerkleRoot(merkleRoot).send({ from: account });
            
            const verifyRes = await uploadContract.methods.verifyProof(account, proof, testHash256, index_2).call({ from: account})
            console.log('Proof Verified? ', verifyRes);

            /* const fileUrl = `https://yellow-tiny-meadowlark-314.mypinata.cloud/ipfs/${cid}`;
            console.log('account', account)
            const tx = await uploadContract.methods.add(account, cid).send({ from: account });
            console.log('Transaction:', tx);
            console.log(`File stored with CID ${cid}`);
            console.log(`Preview url ${fileUrl}`);
            alert('File uploaded successfully!'); */

            setFile(null);
            setFileName("No image selected");

        } catch (error) {
            console.error("Unable to upload file.", error);
        }
    }
  };

  const retrieveFile = (e) => {
    console.log("Retrieving file...");
    const file = e.target.files[0];
    if (file) {
      // Check if the file exists
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        setFile(file); // Set file when it's loaded
      };

      reader.onerror = () => {
        // Handle errors (optional)
        console.error("Error reading file");
        setFile(null);
        setFileName("");
      };

      setFileName(file.name); // Set file name
    }
  };
  return (
    <div className="container pt-5">
      <h2 className="my-4 text-center">Upload file to pinata:</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="border p-4">
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="file-upload" className="btn btn-primary">
                  Choose Image
                </label>
                <input
                  type="file"
                  id="file-upload"
                  name="data"
                  className="form-control-file d-none"
                  onChange={retrieveFile}
                  disabled={!account}
                />
                <small className="form-text text-muted">
                  Image: {fileName}
                </small>
              </div>
              <button
                type="submit"
                className="btn btn-success mt-2"
                disabled={!file}
              >
                Upload File
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
