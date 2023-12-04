import React, { useState } from 'react';
import Modal from './Modal';

const Share = ({ contract, account }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className='container my-4 d-flex justify-content-center'>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                Share Your Files
            </button>
            {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} account={account} />}
        </div>
    );
};

export default Share;
