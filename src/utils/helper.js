import BN from "bn.js";

export const getArrayFromString = (str) => {
  return str.split(",").map((item) => item.trim());
};

export const numStringToBytes32 = (num) => {
  var bn = new BN(num).toTwos(256);
  return padToBytes32(bn.toString(16));
};

export const bytes32ToNumString = (bytes32str) => {
  bytes32str = bytes32str.replace(/^0x/, "");
  var bn = new BN(bytes32str, 16).fromTwos(256);
  return bn.toString();
};

const padToBytes32 = (n) => {
  while (n.length < 64) {
    n = "0" + n;
  }
  return "0x" + n;
};
