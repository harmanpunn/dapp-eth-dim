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

  event Debug(address indexed _user, address indexed sender);

  function display(address _user) external  returns(string[] memory) {
        emit Debug(_user, msg.sender);
      require(_user==msg.sender || ownership[_user][msg.sender],"You don't have access");
      return value[_user];
  }
    function debugAccessCheck(address _user) public view returns(address, address) {
        return (_user, msg.sender);
    }

  function shareAccess() public view returns(Access[] memory){
      return accessList[msg.sender];
  }
}