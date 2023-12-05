import React, { useState } from 'react';
import Modal from './Modal';

const Share = ({ contract, account, selectedFiles, userHash }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [shareFileList, setShareFileList] = useState([]);

    const onShareClick = () => {
        const fileList = Object.keys(selectedFiles).filter(hash => selectedFiles[hash]);
        setShareFileList(fileList);
        setModalOpen(true);
    };

    return (
        <div className='container my-4 d-flex justify-content-end'>
            <button className="btn btn-primary" onClick={onShareClick}>
                Share Your Files
            </button>
            {modalOpen && <Modal setModalOpen={setModalOpen} account={account} shareFileList={shareFileList} userHash={userHash}/>}
        </div>
    );
};

export default Share;
