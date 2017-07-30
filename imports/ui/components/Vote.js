import React from 'react';


export default class Vote extends React.Component{

  render(){
    return (
      <div key={this.props.name} className="form__group">
        <input id={this.props.name} type={this.props.type} value={this.props.name} name={this.props.strawpollId}/>
        <label htmlFor={this.props.name} className="form__label">{this.props.name}</label>
      </div>
    );
  }

}
