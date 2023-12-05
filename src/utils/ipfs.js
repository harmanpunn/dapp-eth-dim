import axios from "axios";

class IPFSInterface {
    constructor(JWT) {
        this.JWT = JWT;
        this.instance = axios.create({
            baseURL: 'https://api.pinata.cloud/',
            timeout: 5000,
        });
    }

    async storeJSONinIPFS(jsonObj) {
        const json_string = JSON.stringify(jsonObj);
        const resFile = await this.instance.post('/pinning/pinJSONToIPFS', json_string, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.JWT,
            },
        });
        return resFile.data.IpfsHash;
    }

    async updateMetadatainIPFS(cid, jsonObj) {
        const json_string = JSON.stringify({ keyvalues: jsonObj, ipfsPinHash: cid });
        await this.instance.put('/pinning/hashMetadata', json_string, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.JWT,
            },
        });
    }

    async getFilesFromIPFSByCID(cid) {
        const resFile = await this.instance.get(`/data/pinList?hashContains=${cid}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.JWT,
            },
        });
        return resFile.data.rows[0];
    }
}

export default IPFSInterface;
