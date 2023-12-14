// import { createHelia } from 'helia';
import React, { useState } from 'react';
import axios from 'axios';
import { sha256 } from"js-sha256";

const IdentityForm = ({identityContract, account}) => {
    const [identityName, setIdentityName] = useState('');
    const [identityEmail, setIdentityEmail] = useState('');
    const [identityPassword, setIdentityPassword] = useState('');
    const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjYmUwZDI1Zi02YmM5LTRjMmQtYWNhYS05NjllNTA0ZTMzNTciLCJlbWFpbCI6Imhhcm1hbnB1bm4yMjEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmYjY3MjVlZGQ5NzU4ZGY0YWE4ZiIsInNjb3BlZEtleVNlY3JldCI6IjQzZDhkNTQzZjU4N2U3M2ZkZmUzZjJhOTgxOGVlNzA4YjVhOTA2M2NiMzlhYmI4MzExYTZmMzRmMmExNGYxMGEiLCJpYXQiOjE3MDE2MzU0ODl9.wvKa60SEMXLreQqrpLSozGD6DqQtwVPlHSTtGfXqmds'

    const generateCustomHash = (email, password) => {
      // TODO: Can create a more complicated operation here
      return sha256(email + password);
    }
    
    const storeIdentity = async (name, email, hash) => {
      const user = {
        name: name,
        email: email,
        hash: hash
      };
      
      const userObj = JSON.stringify(user);
      const resFile = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data: userObj,
        headers: {
          'Content-Type': `application/json`,
          'Authorization': JWT,
        }
      });

      const cid = resFile.data.IpfsHash;
      console.log(`User stored with CID ${cid}`);

      // const obj = await cat(cid);
      // console.log(`User retrieved from CID ${obj}`);
      
      console.log(`Preview url ${`https://yellow-tiny-meadowlark-314.mypinata.cloud/ipfs/${cid}`}`);

      return cid;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('Creating identity:', identityName, identityEmail);

        // generate custom hash
        const hash = generateCustomHash(identityEmail, identityPassword);
        
        if (!identityContract) {
            console.log('identityContract not loaded', identityContract);
            return;
        }

        try {
            const hash_id = await storeIdentity(identityName, identityEmail, hash);
            console.log(`hash_id ${hash_id}`);

            await identityContract.methods.createIdentity(hash, hash_id).send({ from: account });
        } catch (error) {
            console.log('Error, createIdentity: ', error);
        }

        // Reset state (which also clears the form)
        setIdentityName('');
        setIdentityEmail('');
        setIdentityPassword('');
    }

    return (
        <div id="identityManagementSection" className="container mt-4">
          <h2>Identity Management</h2>
          <form id="createIdentityForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newIdentityName">Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="newIdentityName" 
                placeholder="Enter name" 
                required 
                value={identityName} 
                onChange={(e) => setIdentityName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newIdentityEmail">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="newIdentityEmail" 
                placeholder="Enter email" 
                required 
                value={identityEmail} 
                onChange={(e) => setIdentityEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newIdentityPassword">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="newIdentityPassword" 
                placeholder="Enter password" 
                required 
                value={identityPassword} 
                onChange={(e) => setIdentityPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Identity</button>
          </form>
        </div>
      );

}

export default IdentityForm;