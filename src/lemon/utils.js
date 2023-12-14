import { sha256 } from "js-sha256";


export const generateCustomHash = (email, password) => {
    // TODO: Can create a more complicated operation here
    return sha256(email + password);
  };