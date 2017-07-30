import React from 'react';
import ReactDOM from 'react-dom';
import {Tooltip, Legend, PieChart, Pie, Cell} from 'recharts';

import CustomTooltip from './CustomTooltip';

export default class PieChartResult extends React.Component{

  render(){
    this.options_percent = this.props.options.map((opt) => {
      let result = Math.round(((100 * opt.vote)/this.props.total) * 100) / 100;
      return {
        name: opt.name,
        value: result,
        color: opt.color
      };
    });
    return (
      <div className="result">
        <PieChart width={400} height={400}>
          <Pie isAnimationActive={false} labelLine={false} data={this.options_percent} outerRadius="60%" label={false} dataKey="value">
            {
              this.options_percent.map((entry, index) => <Cell key={index} fill={entry.color}/>)
            }
          </Pie>
          <Tooltip content={<CustomTooltip/>}/>
        </PieChart>
      </div>
    );
  }
}
