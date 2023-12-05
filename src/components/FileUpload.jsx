import React, { useState } from "react";
import axios from 'axios';
import keccak256 from "keccak256";

import { generateMerkleTree, getMerkleRoot, getMerkleProof } from "../utils/merkelUtils";
import { getArrayFromString, numStringToBytes32 } from "../utils/helper.js";
import networkInterface from "../utils/ipfs.js";

const FileUpload = ({ account, uploadContract }) => {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image selected");
    const JWT = process.env.REACT_APP_PINATA_JWT;
    const userHash = 'QmSt6yTT9HypY62vXC2KrQpX3CPWxg9YQn1G6M1FDiFV3p'
    
    const storeHashOffChain = async (hash) => {
      try {
        const pinnedItems = await networkInterface.getFilesFromIPFSByCID(userHash);
        console.log('pinnedItems', pinnedItems);
        let filesArray = [];

        if (pinnedItems && pinnedItems.metadata.keyvalues.files) {
          filesArray = getArrayFromString(pinnedItems.metadata.keyvalues.files);
        }

        filesArray.push(hash);
        filesArray = [...new Set(filesArray)];

        const updatedMetadata = {
            files: filesArray.toString(),
        };

        await networkInterface.updateMetadatainIPFS(userHash, updatedMetadata)
      
        return filesArray;
      } catch (error) {
        console.error("Error storing hash offchain", error);
      }
    }

    const getAllStoredHashes = async (account) => {
      try {
        const pinnedItems = await networkInterface.getFilesFromIPFSByCID(userHash);

        let filesArray = [];
        if (pinnedItems && pinnedItems.metadata.keyvalues.files) {
          filesArray = getArrayFromString(pinnedItems.metadata.keyvalues.files);
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
            const cid = await networkInterface.storeFileInIPFS(file);
            const offChainHashFilesArray = await storeHashOffChain(cid);
            
            // const hashes = await getAllStoredHashes(account);
            const hashes = offChainHashFilesArray;
            const merkleTree = generateMerkleTree(hashes);
            const merkleRoot = getMerkleRoot(merkleTree); 
            console.log(hashes)
            
            /*
            const testHash = hashes[1];
            const index_2 = hashes.indexOf(testHash);
            const testHash256 = "0x" + Array.from(keccak256(testHash)).map(byte => byte.toString(16).padStart(2, '0')).join('');

           
            const proof = getMerkleProof(merkleTree, testHash);
            const verifyRes = await uploadContract.methods.verifyProof(account, proof, testHash256, index_2).call({ from: account})
            console.log('Proof Verified? ', verifyRes);
            */

            await uploadContract.methods.storeMerkleRoot(merkleRoot).send({ from: account });

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
