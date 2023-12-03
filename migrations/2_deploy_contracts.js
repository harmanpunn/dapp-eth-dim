const TodoList = artifacts.require("./TodoList.sol");
const IdentityManagement = artifacts.require("./IdentityManagement.sol");

module.exports = function (deployer) {
  deployer.deploy(IdentityManagement);
  deployer.deploy(TodoList);
};
