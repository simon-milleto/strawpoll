import React from 'react';

export default class BarResult extends React.Component{

  render(){
    return (
      <div className="resultbar__single">
        <div className="resultbar__single--text">
          <span className="name">
            {this.props.option.name}
          </span>
          <span className="percent">
            {this.props.percent} %
            <span> - {this.props.option.vote} votes</span>
          </span>
        </div>
        <div className="resultbar__single--wrapper">
          <div className="resultbar__single--bar" style={{width: this.props.percent + '%', backgroundColor: this.props.option.color }}></div>
        </div>
      </div>
    );
  }

}
