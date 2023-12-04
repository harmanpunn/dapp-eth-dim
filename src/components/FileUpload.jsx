import React, { useState } from "react";
import axios from 'axios';

const FileUpload = ({ account, uploadContract }) => {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image selected");
    const JWT = process.env.REACT_APP_PINATA_JWT;

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
            const fileUrl = `https://yellow-tiny-meadowlark-314.mypinata.cloud/ipfs/${cid}`;
            console.log('account', account)
            const tx = await uploadContract.methods.add(account, cid).send({ from: account });
            console.log('Transaction:', tx);
            console.log(`File stored with CID ${cid}`);
            console.log(`Preview url ${fileUrl}`);
            alert('File uploaded successfully!');

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
