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


class SelectFirstPayment extends Component
{
  constructor(props)
  {
    super(props);
    this.getBudgetCycleStartDates = this.getBudgetCycleStartDates.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      averageBlockTime: 60
    };
  }

  componentDidMount() {
    fetch("https://explorer2.energi.network/api/block/average")
        .then(res => {return res.text()})
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              averageBlockTime: result
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              averageBlockTime: 60,
              error
            });
          }
        )
    }

  getBudgetCycleStartDates()
  {
    let gov = this.props.governanceInfo;
    let block = this.props.bestBlock;

    const averageBlockTime = this.state.averageBlockTime;

    let nextSuperblockTime = ((gov.nextsuperblock - block.height) * averageBlockTime) + block.time;


    const budgetCycleTimeperiod = (gov.superblockcycle * averageBlockTime);
    let budgetCycleStartDates = [];

    for (let i = 0; i < 26; i++)
    {
      budgetCycleStartDates.push(nextSuperblockTime + (i * budgetCycleTimeperiod));
    }

    let htmlOptionTags = [];
    for (let i = 0; i < budgetCycleStartDates.length; i++)
    {
      let thisCycleDate = budgetCycleStartDates[i];
      let thisCycleDateStr = new Date();
      thisCycleDateStr.setTime(thisCycleDate * 1000);
      htmlOptionTags.push(<option value={thisCycleDate}>{thisCycleDateStr.toString()}</option>);
    }
    return htmlOptionTags;
  }

  render()
  {
    let props = this.props;
    const error = this.state.error;
    const isLoaded = this.state.isLoaded;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
    return (
      <div>
        <label>
          Payment Date:
          <select name="start_epoch" onChange={props.onChange}>
            { this.getBudgetCycleStartDates() }
          </select>
        </label>
      </div>
    );
  }
  }
}

export default SelectFirstPayment;
