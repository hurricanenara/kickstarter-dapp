import web3 from "./web3";
import Campaign from "./build/Campaign.json";

const Summary = (address) => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};

export default Summary;
