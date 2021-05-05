// deploy code will go here
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");
require("dotenv").config({
  path:
    "/Users/nara/Library/Mobile Documents/com~apple~CloudDocs/kickstart/.env",
});
const { MNEMONIC_VARIABLE, RINKEBY_ENDPOINT } = process.env;

const provider = new HDWalletProvider(MNEMONIC_VARIABLE, RINKEBY_ENDPOINT);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};

deploy();
