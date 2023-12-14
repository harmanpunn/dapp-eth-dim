import Web3 from "web3";

let web3;

if (typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum);
  window.ethereum.enable().catch((error) => {
    // User denied account access
    console.log(error);
  });
} else if (typeof window.web3 !== "undefined") {
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.log(
    "Non-Ethereum browser detected. You should consider trying MetaMask!"
  );
}

export default web3;
