pragma solidity ^0.5.0;

contract IdentityManagement {
    uint public identityCount = 0;
    address[] public addressList;

    struct Identity {
        uint id;
        string hash;
        // string email;
    }

    mapping(address => Identity) public identities;
    
    constructor() public {
        createIdentity("0x00");  
    }

    event IdentityCreated (
        address owner,
        uint id,
        string hash
        // string email
    );
    
    // function createIdentity(string memory _name, string memory _email) public {

    //     if(!isAddressAdded(msg.sender)) {
    //         addressList.push(msg.sender);
    //     }

    //     identityCount ++;
    //     identities[msg.sender] = Identity(identityCount, _name, _email);
    //     emit IdentityCreated(msg.sender, identityCount, _name, _email);
    // }

    function createIdentity(string memory _hash) public {
    
        if(!isAddressAdded(msg.sender)) {
            addressList.push(msg.sender);
        }

        identityCount ++;
        identities[msg.sender] = Identity(identityCount, _hash);
        emit IdentityCreated(msg.sender, identityCount, _hash);
    }

    function isAddressAdded(address _address) public view returns (bool) {
        for (uint i = 0; i < addressList.length; i++) {
            if (addressList[i] == _address) {
                return true;
            }
        }
        return false;
    }
}