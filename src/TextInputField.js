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

class TextInputField extends Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    let props = this.props;
    return (
      <div>
        <label>
          {this.props.fieldLabel}:
          <input name={this.props.fieldName} type="text" onChange={this.props.onChange} />
        </label>
      </div>
    );
  }
}

export default TextInputField;
