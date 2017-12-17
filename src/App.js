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
import logo from './logo256.png';
import './App.css';

class App extends Component
{
  constructor(props)
  {
    super(props);

    // there are 26 payment cycles annually for Energi, so this would be 1 year worth of payments.
    this.maximumNumberOfPaymentCycles = 26;

    this.gobj =
    [
      [
        "proposal",
        {
          "end_epoch": 0,
          "name": "",
          "payment_address": "",
          "payment_amount": 0,
          "start_epoch": 0,
          "type": 1,
          "url": ""
        }
      ]
    ];

    // reference to internal proposal data we need to modify for convenience
    this.state = this.gobj[0][1];

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event)
  {
    const target = event.target;
    const value = target.type == 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({[name]: value});
    this.gobj[0][1] = this.state;
  }

  getBudgetCycleStartDates()
  {
    let budgetCycleStartDates = [ 0, 1, 2, 3 ];
    let htmlOptionTags = [];
    for (let i = 0; i < budgetCycleStartDates.length; i++)
    {
      htmlOptionTags.push(<option key={i} value={i}>{i}</option>);
    }
    return htmlOptionTags;
  }

  getNumberOfPayments()
  {
    let htmlOptionTags = [];
    for (let i = 1; i <= this.maximumNumberOfPaymentCycles; i++)
    {
      htmlOptionTags.push(<option key={i} value={i}>{i} Payments</option>);
    }
    return htmlOptionTags;
  }

  render()
  {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Energi Proposal Creator</h1>
        </header>
        <div className="App-proposalForm">
          <form>
            <label>
              Proposal Name:
              <input name="name" type="text" onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
              Proposal Description URL:
              <input name="url" type="text" onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
              Payment Date:
              <select name="start_epoch" onChange={this.handleInputChange}>
                { this.getBudgetCycleStartDates() }
              </select>
            </label>
            <br />
            <label>
              Payments:
              <select name="end_epoch" onChange={this.handleInputChange}>
                { this.getNumberOfPayments() }
              </select>
            </label>
            <br />
            <label>
              Payment Address:
              <input name="payment_address" type="text" onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
              Payment Amount:
              <input name="payment_amount" type="number" onChange={this.handleInputChange} />
            </label>
          </form>
        </div>

        <p className="App-intro">
          Proposal JSON:
          <pre>
            { JSON.stringify(this.gobj, null, "\t") }
          </pre>
        </p>
      </div>
    );
  }
}

export default App;
