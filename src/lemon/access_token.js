import { aes } from "./encrypt";

export const Token = {
    generateToken : function (payload , privateKey, publicKey, validityTime) {
        if (payload.constructor == Object) {
            payload["validity"] = Date.now() + validityTime;
            return aes.encryptText(JSON.stringify(payload), publicKey, privateKey);
        } else {
            throw new Error("Payload needs to be a dictionary");
        }
    },

    getPayload : function (token, privateKey, publicKey) {
        const payload = aes.decryptText(token, publicKey, privateKey);
        try {
            const payloadDict = JSON.parse(payload);
            if (payloadDict["validity"] > Date.now()) {
                return payloadDict;
            } else {
                throw new Error("Token has expired");
            }
        } catch(e) {
            if(e instanceof SyntaxError){
                throw new Error("Invalid Token");
            }
        }
    }
}
