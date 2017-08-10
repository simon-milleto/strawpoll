import React from 'react';
import { Link } from 'react-router-dom'


export default class StrawpollItem extends React.Component{

  render(){
    let link = `/${this.props.strawpoll._id}`;
    let linkResult = `/${this.props.strawpoll._id}/result`;
    return (
      <Link className="item item--flex" to={link}>
          <span className="item--title">{this.props.strawpoll.question}</span>
          <span className="item--info">{this.props.strawpoll.total} votes</span>
      </Link>
    );
  }

}
