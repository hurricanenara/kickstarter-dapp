import React from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Summary from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends React.Component {
  state = {
    value: "",
    loading: false,
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const campaign = Summary(this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {}
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            onChange={(e) => this.setState({ value: e.target.value })}
            value={this.setState.value}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Button primary>Contribute</Button>
      </Form>
    );
  }
}

export default ContributeForm;
