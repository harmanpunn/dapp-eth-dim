const TodoList = artifacts.require("./TodoList.sol");
const IdentityManagement = artifacts.require("./IdentityManagement.sol");
const Upload = artifacts.require("./Upload.sol");

module.exports = function (deployer) {
  deployer.deploy(IdentityManagement);
  deployer.deploy(Upload);
  deployer.deploy(TodoList);
};
