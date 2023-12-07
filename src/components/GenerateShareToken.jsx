import React, { useEffect, useState } from 'react';
import networkInterface from '../utils/ipfs';
import { generateTokenContent } from '../utils/helper';

const GenerateShareToken = ({account, userHash}) => {
    const [tokenGenerated, setTokenGenerated] = useState(false);
    const [message, setMessage] = useState('');

    const handleGenerateClick = async () => {
        try {
            
            const pinnedItems = await networkInterface.getFilesFromIPFSByCID(userHash);    
            const tokenContent = generateTokenContent(16);    

            const shared_token = await networkInterface.storeJSONinIPFS({share_hash: tokenContent}, account);

            const updatedMetadata = {
                ...pinnedItems.metadata.keyvalues,
                shared_token: shared_token,
            };    

            await networkInterface.updateMetadatainIPFS(userHash, updatedMetadata)

            console.log('token', shared_token);

            setMessage(shared_token);   
            setTokenGenerated(true); 
            

        } catch (e) {
            console.log(e);
        }
        
    };

    useEffect(() => {
        const checkToken = async () => {
            const pinnedItems = await networkInterface.getFilesFromIPFSByCID(userHash);
            if(!pinnedItems  && pinnedItems.metadata.keyvalues && pinnedItems.metadata.keyvalues.shared_token != undefined && pinnedItems.metadata.keyvalues.shared_token != ''){
                setTokenGenerated(true);
                setMessage(pinnedItems.metadata.keyvalues.shared_token);
            }
        };
        checkToken();

    }, []);

    const handleRescindClick = async () => {

        const pinnedItems = await networkInterface.getFilesFromIPFSByCID(userHash);

        if(pinnedItems.metadata.keyvalues.shared_token != undefined){
            const shared_token = pinnedItems.metadata.keyvalues.shared_token;
            
            let share_metadata = await networkInterface.getFilesFromIPFSByCID(shared_token);

            share_metadata = !share_metadata["metadata"]["keyvalues"] ? {} : share_metadata["metadata"]["keyvalues"];
            console.log('handleRescindClick {} share_metadata', share_metadata);
            // if(share_metadata["files"] != undefined){
            //   user_metadata["shared_files"] += share_metadata["files"];
            // }

            const updatedMetadata = {
                ...pinnedItems.metadata.keyvalues,
                shared_files: !pinnedItems.metadata.keyvalues.shared_files ? share_metadata["files"] : pinnedItems.metadata.keyvalues.shared_files + ','+share_metadata["files"],
                shared_token: '',
            };  

            await networkInterface.deleteFileByCID(shared_token);
            await networkInterface.updateMetadatainIPFS(userHash, updatedMetadata)

        }    
        
        setTokenGenerated(false);
        setMessage('');
    };

    return (
        <div className="container mt-3">
        <h2 className="mb-3">Generate a token to request files from another user</h2>
        {tokenGenerated ? (
            <button className="btn btn-danger" onClick={handleRescindClick}>Rescind Token</button>
        ) : (
            <button className="btn btn-primary" onClick={handleGenerateClick}>Generate Token</button>
        )}
        {message && <p className="alert alert-success mt-3">{message}</p>}
    </div>
    );
};

export default GenerateShareToken;
