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
import PrepareForm from './PrepareForm.js';

class App extends Component
{
  constructor(props)
  {
    super(props);

    // reference to internal proposal data we need to modify for convenience
    this.state = {
      gobj: [
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
      ],
      governanceInfo: {},
      bestBlock: {},
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    return fetch('http://explore.test.energi.network/api/getgovernanceinfo')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          governanceInfo: responseJson
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleInputChange(event)
  {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let new_gobj = this.state.gobj;
    new_gobj[0][1][name] = value;
    this.setState({gobj: new_gobj});
  }

  render()
  {
    let prepareform_props = {
      onChange: this.handleInputChange
    };
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Energi Proposal Creator</h1>
        </header>
        <PrepareForm {...prepareform_props} />

        <div>
          <p className="App-intro">
            Current State:
            <pre>
              { JSON.stringify(this.state, null, "\t") }
            </pre>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
