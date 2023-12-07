export const getArrayFromString = (str) => {
  return str.split(",").map((item) => item.trim());
};


export const generateTokenContent = (length) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}