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
      payment_cycles: 1,
      governanceInfo: {},
      bestBlock: {},
      validationError: "",
      submitted: false,
      confirmations: 0
    }

    this.explorerAPI = '';
    this.apiSyncState = 0;

    this.setError = this.setError.bind(this);
    this.hasError = this.hasError.bind(this);
    this.validateNewState = this.validateNewState.bind(this);
    this.waitForConfirmations = this.waitForConfirmations.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getGovernanceInfo = this.getGovernanceInfo.bind(this);
    this.getBestBlock = this.getBestBlock.bind(this);
    this.updateNetwork = this.updateNetwork.bind(this);
    this.initializeEpochs = this.initializeEpochs.bind(this);
  }

  getGovernanceInfo()
  {
    return fetch(this.explorerAPI + 'getgovernanceinfo')
    .then((resp) => {
      if (resp.ok) {
        return resp.json()
          .then((responseData) => {
            this.setState({governanceInfo: responseData},
              function()
              {
                this.apiSyncState++;
                if (this.apiSyncState == 2) this.initializeEpochs();
              }
            );
            return responseData;
          });
      }
      return resp.json()
        .then((error) => {
          return Promise.reject(error);
        });
    })
    .catch(err => {this.setError("Unable to fetch current blockchain information. Please try again later. " + err.toString())});
  }

  getBestBlock()
  {
    function getBlock(hash)
    {
      return fetch(this.explorerAPI + 'getblock?hash=' + hash)
      .then((resp) => {
        if (resp.ok) {
          return resp.json()
            .then((responseData) => {
              this.setState({bestBlock: responseData},
                function()
                {
                  this.apiSyncState++;
                  if (this.apiSyncState == 2) this.initializeEpochs();
                }
              );
              return responseData;
            });
        }
        return resp.json()
          .then((error) => {
            return Promise.reject(error);
          });
      })
      .catch(err => {this.setError("Unable to fetch current blockchain information. Please try again later. " + err.toString())});
    }

    function getHash(height)
    {
      return fetch(this.explorerAPI + 'getblockhash?index=' + Number(height).toString())
      .then((resp) => {
        if (resp.ok) {
          return resp.text()
            .then((responseData) => {
              getBlock(responseData);
              return responseData;
            });
        }
        return resp.text()
          .then((error) => {
            return Promise.reject(error);
          });
      })
      .catch(err => {this.setError("Unable to fetch current blockchain information. Please try again later. " + err.toString())});
    }

    function getHeight()
    {
      return fetch(this.explorerAPI + 'getblockcount')
      .then((resp) => {
        if (resp.ok) {
          return resp.text()
            .then((responseData) => {
              return getHash(responseData);
            });
        }
        return resp.text()
          .then((error) => {
            return Promise.reject(error);
          });
      })
      .catch(err => {this.setError("Unable to fetch current blockchain information. Please try again later. " + err.toString())});
    }
    getHeight = getHeight.bind(this);
    getHash = getHash.bind(this);
    getBlock = getBlock.bind(this);

    getHeight();
  }

  updateNetwork(networkName)
  {
    function fetchBlockchainInfo()
    {
      this.getGovernanceInfo();
      this.getBestBlock();
    }

    fetchBlockchainInfo = fetchBlockchainInfo.bind(this);

    this.setState({network: networkName}, function()
    {
      if (this.state.network === 'main') this.explorerAPI = 'https://explore.energi.network/api/';
      else if (this.state.network == 'test') this.explorerAPI = 'http://explore.test.energi.network/api/';
      else if (this.state.network === 'test60x') this.explorerAPI = 'http://explore.test60x.energi.network/api/';
      else this.setError("Invalid network");

      fetchBlockchainInfo();
    });
  }

  initializeEpochs()
  {
    function sleep(ms)
    {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForSync()
    {
      while (this.apiSyncState != 2) await sleep(100);
    }

    waitForSync = waitForSync.bind(this);
    waitForSync();
    let gov = this.state.governanceInfo;
    let block = this.state.bestBlock;
    let initial_epoch = ((gov.nextsuperblock - block.height) * 60) + block.time;

    let new_gobj = this.state.gobj;
    new_gobj[0][1].start_epoch = initial_epoch;
    new_gobj[0][1].end_epoch = initial_epoch + (gov.superblockcycle * 60);
    this.setState({gobj: new_gobj}, this.validateNewState());
  }

  componentDidMount()
  {
    document.title = "Energi Proposal Creator";

    this.updateNetwork('test60x');
  }

  setError(errStr)
  {
    this.setState({validationError: errStr});
  }

  hasError()
  {
    if (this.state.validationError === '') return false;
    return true;
  }

  validateNewState()
  {
    function validateProposalName(setError, state)
    {
      const name = state.gobj[0][1].name;
      if ((name.length < 5) || (name.length > 20))
      {
        setError("Proposal name must a unique name between 5 and 20 characters in length");
        return false;
      }
      let allowedCharactersRegex = /^[a-z0-9_-]+$/i;
      if (!name.match(allowedCharactersRegex))
      {
        setError("Proposal name may only contain alphanumeric characters, underscores and hypens.");
        return false;
      }
      // TODO: make sure proposal name doesn't match any active proposal names
      return true;
    }

    function validateProposalURL(setError, state)
    {
      const url = state.gobj[0][1].url;
      if (!url.startsWith('http://') && !url.startsWith('https://'))
      {
        setError("Proposal URL must begin with http:// or https://");
        return false;
      }
      if (url.length > 255) // TODO: verify maximum URL length
      {
        setError("Maximum URL length is 255 characters. Please use a URL shortening service.");
        return false;
      }
      return true;
    }

    function validateProposalStart(setError, state)
    {
      const expectedStartDate = ((state.governanceInfo.nextsuperblock - state.bestBlock.height) * 60) + state.bestBlock.time;
      const maxStartDate = expectedStartDate + (state.governanceInfo.superblockcycle * 26 * 60);

      if (state.gobj[0][1].start_epoch < expectedStartDate)
      {
        setError("Please select a valid payment date.");
        return false;
      }
      if (state.gobj[0][1].start_epoch > maxStartDate)
      {
        setError("Please select a valid payment date.");
        return false;
      }
      return true;
    }

    function validateProposalEnd(setError, state)
    {
      if ((state.payment_cycles < 1) || (state.payment_cycles > 26))
      {
        setError("Number of payment cycles must be between 1 and 26");
        return false;
      }
      if (state.gobj[0][1].end_epoch < state.gobj[0][1].start_epoch)
      {
        setError("Please select a valid payment date.");
        return false;
      }
      return true;
    }

    function validateProposalAddress(setError, state)
    {
      // Energi main net addresses start with 'E' and testnet addresses start with 't'
      const addrPrefix = state.network === 'main' ? '^E' : '^t';
      const validChars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      const regexStr = addrPrefix + '[' + validChars + ']{33}$';
      let prefixRegex = new RegExp(regexStr, "i");
      const payment_address = state.gobj[0][1].payment_address;
      if (!payment_address.match(prefixRegex) || (payment_address.length !== 34))
      {
        setError("Payment address is not valid");
        return false;
      }
      return true;
    }

    function validateProposalAmount(setError, state)
    {
      const maximumBudgetAmount = state.governanceInfo.lastsuperblock === 0 ? 4000000 : 184000;
      const payment_amount = state.gobj[0][1].payment_amount;
      if (payment_amount > maximumBudgetAmount)
      {
        setError("Payment amount exceeds maximum budget of " + maximumBudgetAmount.toString() + " NRG");
        return false;
      }
      if (payment_amount <= 0)
      {
        setError("Payment amount must be greater than 0");
        return false;
      }
      return true;
    }

    function validateProposalType(setError, state)
    {
      if (state.gobj[0][1]['type'] !== 1)
      {
        setError("Proposal type must be equal to 1");
        return false;
      }
      return true;
    }

    // clear the error state and begin validation
    this.setError("");
    let result = true;
    result = result && validateProposalName(this.setError, this.state);
    result = result && validateProposalURL(this.setError, this.state);
    result = result && validateProposalStart(this.setError, this.state);
    result = result && validateProposalEnd(this.setError, this.state);
    result = result && validateProposalAddress(this.setError, this.state);
    result = result && validateProposalAmount(this.setError, this.state);
    result = result && validateProposalType(this.setError, this.state);
  }

  waitForConfirmations()
  {
    function fetchConfirmations()
    {
      return fetch(this.explorerAPI + 'getrawtransaction?txid=' + this.state.collateral_txhash + '&decrypt=1')
      .then((resp) => {
        if (resp.ok) {
          return resp.json()
            .then((responseData) => {
              let confirmation_count = responseData.confirmations || 0;
              this.setState({confirmations: confirmation_count});
              return responseData.confirmations;
            });
        }
        return resp.json()
          .then((error) => {
            return Promise.reject(error);
          });
      })
      .catch(err => {this.setState({confirmations: 0, fetchConfirmationsErr: err.toString()})});
    }

    function sleep(ms)
    {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function checkConfirmations()
    {
      while (this.state.confirmations < 6)
      {
        fetchConfirmations();
        await sleep(30000); // check every 30 seconds since Energi has 1 minute block times
      }
    }

    fetchConfirmations = fetchConfirmations.bind(this);
    checkConfirmations = checkConfirmations.bind(this);

    checkConfirmations();
  }

  handleInputChange(event)
  {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name === 'collateral_txhash')
    {
      this.setState({collateral_txhash: value}, this.waitForConfirmations);
    }
    else
    {
      // make sure numbers are numbers
      if ((name === 'start_epoch')
        || (name === 'end_epoch')
        || (name === 'payment_amount'))
      {
          value = Number(value) || 0;
      }

      let new_state =
      {
        gobj: this.state.gobj,
        payment_cycles: this.state.payment_cycles,
        submitted: false
      };

      new_state.gobj[0][1][name] = value;
      if ((name === 'start_epoch') || (name === 'end_epoch'))
      {
        if (name === 'end_epoch') new_state.payment_cycles = value;
        new_state.gobj[0][1].end_epoch = new_state.gobj[0][1].start_epoch + (new_state.payment_cycles * this.state.governanceInfo.superblockcycle * 60);
      }

      this.setState(new_state, this.validateNewState());
    }
  }

  handleSubmit(/*event*/)
  {
    const dateTime = new Date().getTime();
    const timestamp = Math.floor(dateTime / 1000);
    this.setState({submitted: true, proposalTime: timestamp}, this.validateNewState());
  }

  render()
  {
    let prepareform_props = {
      onChange: this.handleInputChange,
      onSubmit: this.handleSubmit,
      validationError: this.state.validationError,
      governanceInfo: this.state.governanceInfo,
      bestBlock: this.state.bestBlock,
      gobj: this.state.gobj,
      payment_cycles: this.state.payment_cycles,
      submitted: this.state.submitted,
      collateral_txhash: this.state.collateral_txhash,
      confirmations: this.state.confirmations,
      proposalTime: this.state.proposalTime
    };
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Energi Proposal Creator</h1>
        </header>
        <PrepareForm {...prepareform_props} />
      </div>
    );
  }
}

/*
        <div>
          <p className="App-intro">
            Current State:
            <pre>
              { JSON.stringify(this.state, null, "\t") }
            </pre>
          </p>
        </div>
*/

export default App;
