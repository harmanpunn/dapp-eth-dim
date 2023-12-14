pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Upload {
  
  struct Access{
     address user; 
     bool access; 
  }
  mapping(address=>string[]) value;
  mapping(address=>mapping(address=>bool)) ownership;
  mapping(address=>Access[]) accessList;
  mapping(address=>mapping(address=>bool)) previousData;
  mapping(address => bytes32) public merkleRoots;

    function storeMerkleRoot(bytes32 _merkleRoot) external {
        merkleRoots[msg.sender] = _merkleRoot;
    }

  function add(address _user, string calldata url) external {
      value[_user].push(url);
  }
  function allow(address user) external {
      ownership[msg.sender][user]=true; 
      if(previousData[msg.sender][user]){
         for(uint i=0;i<accessList[msg.sender].length;i++){
             if(accessList[msg.sender][i].user==user){
                  accessList[msg.sender][i].access=true; 
             }
         }
      } else {
          accessList[msg.sender].push(Access(user,true));  
          previousData[msg.sender][user]=true;  
      }
    
  }
  function disallow(address user) public {
      ownership[msg.sender][user]=false;
      for(uint i=0;i<accessList[msg.sender].length;i++){
          if(accessList[msg.sender][i].user==user){ 
              accessList[msg.sender][i].access=false;  
          }
      }
  }


  function display(address _user) external view returns(string[] memory) {
      require(_user==msg.sender || ownership[_user][msg.sender],"You don't have access");
      return value[_user];
  }
  
    function debugAccessCheck(address _user) public view returns(address, address) {
        return (_user, msg.sender);
    }

  function shareAccess() public view returns(Access[] memory){
      return accessList[msg.sender];
  }

  function verifyProof (
        address user,
        bytes32[] memory proof,
        bytes32 leaf,
        uint256 index
    ) public view returns (bool) {
        bytes32 root = merkleRoots[user];
        bytes32 hash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (index % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, proofElement));
            } else {
                hash = keccak256(abi.encodePacked(proofElement, hash));
            }
            index = index / 2;
        }

        return hash == root;
    }

    function debugVerifyCheck(
            address _user,
            bytes32[] memory proof,
            bytes32 leaf,
            uint256 index
            ) public view returns(address, bytes32[] memory, bytes32, uint256, bytes32, bytes32) {
                bytes32 root = merkleRoots[_user];
                bytes32 hash = leaf;

               for (uint256 i = 0; i < proof.length; i++) {

                if (index % 2 == 0) {
                    hash = keccak256(abi.encodePacked(hash, proof[i]));
                } else {
                    hash = keccak256(abi.encodePacked(proof[i], hash));
                }
            index = index / 2;
        }  

            return (_user, proof, leaf, index, hash, root);
        }

}