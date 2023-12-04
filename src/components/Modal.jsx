import React, { useEffect, useState } from 'react';

const Modal = ({ setModalOpen, contract, account }) => {
    const [addressList, setAddressList] = useState([]);

    const sharing = async () => {
        const address = document.querySelector(".address-input").value;
        await contract.methods.allow(address).send({ from: account });
        setModalOpen(false);
    };

    useEffect(() => {
        const accessList = async () => {
            const addresses = await contract.methods.shareAccess().call({ from: account });
            setAddressList(addresses.map(addr => addr.user)); // Assuming 'addr.user' is the structure
        };
        contract && accessList();
    }, [contract]);

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
                        <select className="form-control mt-3" id="selectNumber">
                            <option>People With Access</option>
                            {addressList.map((address, index) => (
                                <option key={index} value={address}>{address}</option>
                            ))}
                        </select>
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
            {/* <div className="modal-backdrop fade show"></div>     */}
        </div>
    );
};

export default Modal;
