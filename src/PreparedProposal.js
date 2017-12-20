/* Energi Proposal Creator
*
* The following JSON represents an Energi proposal object that can be submitted to the blockchain.
* The purpose of this app is to create and validate this data based on user input, and then prepare
* the commands a user would use to submit this object to the Energi blockchain.

[
   [
      "proposal",
      {
         "end_epoch":1521329930,
         "name":"TITLE",
         "payment_address":"someaddr",
         "payment_amount":1337,
         "start_epoch":1513603490,
         "type":1,
         "url":"https://example.com/title-proposal"
      }
   ]
]
*/

import React, { Component } from 'react';

class PreparedProposal extends Component
{
  constructor(props)
  {
    super(props);
    this.getPrepareProposalCmd = this.getPrepareProposalCmd.bind(this);
  }

  getPrepareProposalCmd()
  {
    function to_hex(str)
    {
      return str.replace(/./g, c => c.charCodeAt(0).toString(16));
    }

    return "gobject prepare 0 1 " + this.props.gobj[0][1].start_epoch + " " + to_hex(JSON.stringify(this.props.gobj));
  }

  render()
  {
    let props = this.props;

    if (this.props.validationError !== '') return null;

    return (
      <div class="App-preparedProposalDiv">
        <p>
          {this.getPrepareProposalCmd()}
        </p>
      </div>
    );
  }
}

export default PreparedProposal;
