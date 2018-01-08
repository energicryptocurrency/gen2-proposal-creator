/* Energi Proposal Creator
*/

import React, { Component } from 'react';

class SelectNetwork extends Component
{
  getNetworks()
  {
    let htmlOptionTags = [];
    htmlOptionTags.push(<option value="main"> main </option>);
    htmlOptionTags.push(<option value="test"> test </option>);
    htmlOptionTags.push(<option value="test60x"> test60x </option>);
    return htmlOptionTags;
  }

  render()
  {
    let props = this.props;
    return (
      <div>
        <label>
          Network:
          <select name="networkSelector" onChange={props.onChange}>
            { this.getNetworks() }
          </select>
        </label>
      </div>
    );
  }
}

export default SelectNetwork;
