pragma solidity ^0.5.0;

contract IdentityManagement {

    mapping(address => string) public identities;

    event IdentityCreated (address owner);
    
    function createIdentity(string memory cipher) public {
        require(!userExists(msg.sender), "Each address can have only one account");
        identities[msg.sender] = cipher;
        emit IdentityCreated(msg.sender);
    }

    function userExists(address _address) public view returns (bool) {
        return bytes(identities[_address]).length > 0;
    }

}