import React from 'react';
import {Tracker} from 'meteor/tracker';
import { Link, NavLink } from 'react-router-dom'
import FlipMove from 'react-flip-move';

import { Strawpolls } from './../api/strawpolls';

import Loader from './components/Loader';
import StrawpollItem from './components/StrawpollItem';


export default class StrawpollsList extends React.Component{

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    Tracker.autorun(() => {
      this.fetchStrawpoll(this.props.match.params.sort);
    });
  };

  componentWillReceiveProps = (props) => {
    if (props.match.url !== this.props.match.url) {
      this.fetchStrawpoll(props.match.params.sort)
    }
  };

  renderStrawpoll = () => {
    if(this.state.strawpolls.length === 0) {
      return <Loader />;
    }else{
      return this.state.strawpolls.map((strawpoll) => {
        return (
          <StrawpollItem key={strawpoll._id} strawpoll={strawpoll}/>
        );
      });
    }
  };

  fetchStrawpoll = (sorting) => {
    let sort;
    switch (sorting) {
      case 'recent':
        this.title = 'Recent';
        sort = { sort : {date: -1 }};
        break;
      case 'old':
        this.title = 'Old';
        sort = { sort : {date: 1 }};
        break;
      case 'popular':
        this.title = 'Popular';
        sort = { sort : {total: -1 }};
        break;
    }
    let strawpolls = Strawpolls.find({}, sort);
    if (strawpolls) {
      this.setState({strawpolls: strawpolls});
    }
  };

  render(){
    return (
      <div>
        <h2>{this.title} strawpolls</h2>
        <div>
          <FlipMove duration={400} maintainContainerHeight={true} easing="ease-out">
            {this.renderStrawpoll()}
          </FlipMove>
        </div>
      </div>
    );
  }
}
