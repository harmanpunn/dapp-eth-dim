
import Cookies from 'universal-cookie';

export const isAuthenticated = (identityContract) => {
  return new Promise(async (resolve, reject) => {
    const cookies = new Cookies();
    const token = cookies.get('access_token');
    if (!token) {
      console.log("No token found. Redirecting to login page.");
      reject(false);
    } else {
      const cipher = await identityContract.methods.getUserCipher().call({ from: account });
      try {
        const payload = Token.getPayload(token, cipher, account);
        resolve(payload);
      } catch (error) {
        console.log("Invalid token. Redirecting to login page.");
        reject(false);
      }
    }
  });
}

