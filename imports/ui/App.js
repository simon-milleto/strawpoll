import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Router, Route } from 'react-router';

import history from '../config/history';

import CreatePoll from './CreatePoll';
import StrawpollVote from './StrawpollVote';
import StrawpollResult from './StrawpollResult';
import StrawpollsList from './StrawpollsList';

import Header from './components/Header';
import Footer from './components/Footer';

export default class App extends React.Component{
  render(){
    return (
      <div>
        <Router history={history}>
          <div className="main">
            <Header/>
            <div className="wrapper wrapper--fluid">
              <Route exact path="/" component={CreatePoll}/>
              <Route exact path="/strawpolls/:sort" component={StrawpollsList}/>
              <Route exact path="/:id" component={StrawpollVote}/>
              <Route path="/:id/result" component={StrawpollResult}/>
            </div>
            <Footer/>
          </div>
        </Router>
      </div>
    );
  }
}
