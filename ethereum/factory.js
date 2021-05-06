import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x9EB3465dfe9aa850a0ba13F61f90711f3c0c3610"
);

export default instance;
