export const getArrayFromString = (str) => {
  return str.split(",").map((item) => item.trim());
};
