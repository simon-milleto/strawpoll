import React from 'react';
import { Link } from 'react-router-dom'

export default class Header extends React.Component{
  render(){
    return (
      <header>
        <div className="wrapper">
          <Link to="/"><h1>Strawpoll</h1></Link>
        </div>
      </header>
    );
  }
}
