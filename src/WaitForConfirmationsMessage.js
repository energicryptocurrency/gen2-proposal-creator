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

class WaitForConfirmationsMessage extends Component
{
  constructor(props)
  {
    super(props);
    this.time_remaining = this.time_remaining.bind(this);
    this.get_confirmation_message = this.get_confirmation_message.bind(this);
  }

  time_remaining()
  {
    let time_remaining = (6 - this.props.confirmations);
    return '' + time_remaining.toString() + ' minutes remaining';
  }

  get_confirmation_message()
  {
    if (this.props.confirmations >= 6)
    {
      return 'Transaction ' + this.props.collateral_txhash + ' confirmed!';
    }
    else
    {
      return 'Waiting for confirmations: ' + this.props.confirmations.toString() + '/6 confirmations (Estimated ' + this.time_remaining() + ')';
    }
  }

  render()
  {
    let props = this.props;
    if ((props.collateral_txhash === '') || (props.collateral_txhash == null)) return null;

    return (
      <div class="App-displayTotalDiv">
        <p>
          {this.get_confirmation_message()}
        </p>
      </div>
    );
  }
}

export default WaitForConfirmationsMessage;
