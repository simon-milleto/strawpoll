import React from 'react';

export default class Answer extends React.Component{

  render(){
    return (
      <input
        className="form__input form__input--title"
        onChange={this.props.handleChange}
        type="text" name="answer"
        placeholder="Option"/>
    );
  }
}
