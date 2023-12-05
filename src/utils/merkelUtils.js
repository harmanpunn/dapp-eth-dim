import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

export const generateMerkleTree = (hashes) => {
  const leaves = hashes.map((hash) => keccak256(hash));
  return new MerkleTree(leaves, keccak256, { sortPairs: true });
};

export const getMerkleRoot = (tree) => {
  return tree.getHexRoot();
};

export const getMerkleProof = (tree, hash) => {
  return tree.getHexProof(keccak256(hash));
};
