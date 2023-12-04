pragma solidity ^0.5.0;

contract IdentityManagement {
    struct Identity {
        string user_hash;
        string user_data_hash;
    }

    mapping(address => Identity) public identities;

    event IdentityCreated (address owner);
    
    function createIdentity(string memory user_hash, string memory user_data_hash) public {
        require(!userExists(msg.sender), "Each address can have only one account");
        identities[msg.sender] = Identity(user_hash, user_data_hash);
        emit IdentityCreated(msg.sender);
    }

    function validateIdentity(string memory user_hash) public view returns (bool) {
        return keccak256(abi.encodePacked(user_hash)) == keccak256(abi.encodePacked(identities[msg.sender].user_hash));
    }
    
    function userExists(address _address) public view returns (bool) {
        return bytes(identities[_address].user_hash).length > 0;
    }
}