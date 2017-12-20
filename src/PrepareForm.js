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
import TextInputField from './TextInputField.js';
import SelectFirstPayment from './SelectFirstPayment.js';
import SelectPaymentCycles from './SelectPaymentCycles.js';
import DisplayTotal from './DisplayTotal.js';
import ValidationError from './ValidationError.js';

class PrepareForm extends Component
{
  /*
  constructor(props)
  {
    super(props);
  }
  */

  render()
  {
    let firstPayment_props = {
      governanceInfo: this.props.governanceInfo,
      bestBlock: this.props.bestBlock
    };

    return (
        <div className="App-prepareForm">
        <div>
          <form>
            <TextInputField fieldLabel="Proposal Name" fieldName="name" onChange={this.props.onChange} />
            <TextInputField fieldLabel="Proposal Description URL" fieldName="url" onChange={this.props.onChange} />
            <SelectFirstPayment {...firstPayment_props} onChange={this.props.onChange} />
            <SelectPaymentCycles onChange={this.props.onChange} />
            <TextInputField fieldLabel="Payment Address" fieldName="payment_address" onChange={this.props.onChange} />
            <TextInputField fieldLabel="Payment Amount" fieldName="payment_amount" onChange={this.props.onChange} />
          </form>
        </div>
        <DisplayTotal {...this.props} />
        <ValidationError error={this.props.validationError} />
        </div>
    );
  }
}

export default PrepareForm;
