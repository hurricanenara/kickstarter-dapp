import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x46D821CaD53b08bDD4f60534Ac8C9b3eb3fF5c47"
);

export default instance;
