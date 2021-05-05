const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compliedFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compliedFactory.interface))
    .deploy({ data: compliedFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //es6 syntax to below two lines
  //   const addresses = await factory.methods.getDeployedCampaigns().call();
  //   campaignAddress = addresses[0];
  campaign = await new web3.eth.Contract(
    jSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});
