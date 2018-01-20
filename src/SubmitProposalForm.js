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

class SubmitProposalForm extends Component
{
  constructor(props)
  {
    super(props);
    this.submitProposalCmd = this.submitProposalCmd.bind(this);
  }

  submitProposalCmd()
  {
    function to_hex(str)
    {
      return str.replace(/./g, c => c.charCodeAt(0).toString(16));
    }

    return "gobject submit 0 1 " + this.props.proposalTime + " " + to_hex(JSON.stringify(this.props.gobj)) + " " + this.props.collateral_txhash;
  }

  render()
  {
    if (this.props.confirmations < 6) return null;

    return (
      <div>
        <p>Please copy the following into the debug console of your local wallet to submit the proposal.</p>
        <div class="App-preparedProposalDiv">
          <p>
            {this.submitProposalCmd()}
          </p>
        </div>
      </div>
    );
  }
}

export default SubmitProposalForm;
