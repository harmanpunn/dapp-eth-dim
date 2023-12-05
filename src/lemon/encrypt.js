import CryptoJS from "crypto-js";

export const aes = {
    encryptText: function(text, key, iv) {
        const parsedKey = CryptoJS.enc.Utf8.parse(key);
        const parsedIv = CryptoJS.enc.Utf8.parse(iv);

        const encrypted = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(text),
            parsedKey,
            { iv: parsedIv, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.Pkcs7 }
        );
        return encrypted.toString();
    },
    decryptText: function(encryptedText, key, iv) {
        const parsedKey = CryptoJS.enc.Utf8.parse(key);
        const parsedIv = CryptoJS.enc.Utf8.parse(iv);

        const decrypted = CryptoJS.AES.decrypt(
            encryptedText,
            parsedKey,
            { iv: parsedIv, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.Pkcs7 }
        );
        return CryptoJS.enc.Utf8.stringify(decrypted);
    }
};
