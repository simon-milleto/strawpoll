import React from 'react';
import {Tracker} from 'meteor/tracker';
import { Link } from 'react-router-dom'

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
      let strawpolls = Strawpolls.find({}, { sort : {total: -1 }});
      if (strawpolls) {
        this.setState({strawpolls: strawpolls});
      }
    });
  };

  render(){
    if (this.state.strawpolls) {
      let strawpolls = this.state.strawpolls.map((strawpoll) => {
        return (
          <StrawpollItem key={strawpoll._id} strawpoll={strawpoll}/>
        );
      });
      return (
        <div>
          <h2>Popular strawpolls</h2>
          <div>
            {strawpolls}
          </div>
        </div>
      );
    }
    return (
      <Loader/>
    );

  }

  showModal = () => {
    this.refs.modal.show();
  };

  hideModal = () => {
    this.refs.modal.hide();
  };
}
