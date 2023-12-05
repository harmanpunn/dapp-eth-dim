import axios from "axios";

const JWT = process.env.REACT_APP_PINATA_JWT;

class IPFSInterface {
  constructor(JWT) {
    this.JWT = JWT;
    this.instance = axios.create({
      baseURL: "https://api.pinata.cloud/",
      timeout: 5000,
    });
  }

  async storeJSONinIPFS(jsonObj) {
    const json_string = JSON.stringify(jsonObj);
    const resFile = await this.instance.post(
      "/pinning/pinJSONToIPFS",
      json_string,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.JWT,
        },
      }
    );
    return resFile.data.IpfsHash;
  }

  async storeFileInIPFS(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const resFile = await this.instance.post(
        "/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.JWT,
          },
        }
      );
      return resFile.data.IpfsHash;
    } catch (error) {
      console.log("Error storing file in IPFS", error);
      return null;
    }
  }

  async updateMetadatainIPFS(cid, jsonObj) {
    const json_string = JSON.stringify({
      keyvalues: jsonObj,
      ipfsPinHash: cid,
    });
    await this.instance.put("/pinning/hashMetadata", json_string, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: this.JWT,
      },
    });
  }

  async getFilesFromIPFSByCID(cid) {
    const resFile = await this.instance.get(
      `/data/pinList?hashContains=${cid}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.JWT,
        },
      }
    );
    return resFile.data.rows[0];
  }
}

const networkInterface = new IPFSInterface(JWT);
export default networkInterface;
