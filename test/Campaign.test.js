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
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy microphone", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();

    assert.strictEqual("Buy microphone", request.description);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });
    await campaign.methods
      .createRequest("Items", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
