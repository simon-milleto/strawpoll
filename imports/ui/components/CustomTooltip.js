import React from 'react';
import ReactDOM from 'react-dom';
import {Tooltip, Legend, PieChart, Pie, Cell} from 'recharts';

export default class CustomTooltip extends React.Component{

  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].payload.name} : ${payload[0].value}`} %</p>
        </div>
      );
    }

    return null;
  };
}
