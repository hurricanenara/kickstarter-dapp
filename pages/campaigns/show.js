import React from "react";
import { Card } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Summary from "../../ethereum/campaign";

class CampaignShow extends React.Component {
  static async getInitialProps(props) {
    const campaign = Summary(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsLength: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsLength,
      approversCount,
      manager,
    } = this.props;
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
    ];
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Show Page</h3>
        {this.renderCards()}
      </Layout>
    );
  }
}

export default CampaignShow;
