import React, { useEffect, useState } from 'react';
import networkInterface from '../utils/ipfs';

const Modal = ({ setModalOpen, account, shareFileList, userHash }) => {


    const sharing = async () => {
        const address = document.querySelector(".address-input").value;
        const shareToken = document.querySelector(".share-token-input").value;
        console.log(address, shareToken);
        // Remove duplicates from shareFileList
        shareFileList = [...new Set(shareFileList)];

        const updatedMetadata = {
            sharedFiles: shareFileList.toString(),
        };

        await networkInterface.updateMetadatainIPFS(userHash, updatedMetadata)

        setModalOpen(false);
    };

    return (
        <div className="modal show fade" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Share with</h5>
                        <button type="button" className="close" onClick={() => setModalOpen(false)}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            className="form-control address-input"
                            placeholder="Enter Address"
                        />
                        <input
                            type="text"
                            className="form-control share-token-input mt-3"
                            placeholder="Enter Share Token Provided by the Owner"
                        />
                        {/* <select className="form-control mt-3" id="selectNumber">
                            <option>People With Access</option>
                            {addressList.map((address, index) => (
                                <option key={index} value={address}>{address}</option>
                            ))}
                        </select> */}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={sharing}>
                            Share
                        </button>
                    </div>
                </div>
            </div>
            {/* <div className="modal-backdrop fade hide"></div>     */}
        </div>
    );
};

export default Modal;
