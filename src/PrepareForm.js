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
import SelectFirstPayment from './SelectFirstPayment.js';
import SelectPaymentCycles from './SelectPaymentCycles.js';

class PrepareForm extends Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
        <div className="App-prepareForm">
          <form>
            <label>
              Proposal Name:
              <input name="name" type="text" onChange={this.props.onChange} />
            </label>
            <br />
            <label>
              Proposal Description URL:
              <input name="url" type="text" onChange={this.props.onChange} />
            </label>
            <br />
            <SelectFirstPayment onChange={this.props.onChange} />
            <SelectPaymentCycles onChange={this.props.onChange} />
            <br />
            <label>
              Payment Address:
              <input name="payment_address" type="text" onChange={this.props.onChange} />
            </label>
            <br />
            <label>
              Payment Amount:
              <input name="payment_amount" type="number" onChange={this.props.onChange} />
            </label>
          </form>
        </div>
    );
  }
}

export default PrepareForm;
