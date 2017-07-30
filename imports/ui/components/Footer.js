import React from 'react';
import { Link } from 'react-router-dom'

export default class Footer extends React.Component{
  render(){
    return (
      <footer>
        <div className="wrapper--flex wrapper--fluid">
          <span>Strawpoll - 2017</span>
          <Link to="/">Create your own strawpoll</Link>
          <Link to="/strawpolls/popular">Popular</Link>
          <Link to="/strawpolls/recent">Recent</Link>
        </div>
      </footer>
    );
  }
}
