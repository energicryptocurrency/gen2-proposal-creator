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

class DisplayTotal extends Component
{
  constructor(props)
  {
    super(props);

    this.get_total = this.get_total.bind(this);
    this.get_date_str = this.get_date_str.bind(this);
  }

  get_total()
  {
    return this.props.gobj[0][1].payment_amount * this.props.payment_cycles;
  }

  get_date_str()
  {
    function format_date(timestamp)
    {
      let date = new Date();
      date.setTime(timestamp * 1000);
      return date.toString();
    }

    const start_epoch = this.props.gobj[0][1].start_epoch;
    const end_epoch = this.props.gobj[0][1].end_epoch;

    if (this.props.payment_cycles == 1)
    {
      return "at " + format_date(start_epoch);
    }

    return "at " + format_date(start_epoch) + " ending at " + format_date(end_epoch);
  }

  render()
  {
    let props = this.props;

    if (this.props.gobj[0][1].payment_amount <= 0) return null;

    return (
      <div class="App-displayTotalDiv">
        Total: {this.get_total()} NRG {this.get_date_str()}
      </div>
    );
  }
}

export default DisplayTotal;
