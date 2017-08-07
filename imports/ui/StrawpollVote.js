import { Meteor } from 'meteor/meteor';
import React from 'react';
import {Tracker} from 'meteor/tracker';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'

import { Strawpolls } from './../api/strawpolls';

import Loader from './components/Loader';
import Vote from './components/Vote';

export default class StrawpollVote extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
    this.link = `/${this.props.match.params.id}/result`
  }

  componentWillMount() {
    this.c = Tracker.autorun(() => {
      const strawpoll = Strawpolls.findOne({ "_id": this.props.match.params.id });
      this.setState({strawpoll: strawpoll});
    })
  };

  componentWillUnmount() {
    this.c.stop()
  };

  render(){
    const { redirect } = this.state;

    if (redirect) {
      let route = `/${this.props.match.params.id}/result`
      return <Redirect to={route}/>;
    }

    if (this.state.strawpoll) {

      if (this.state.strawpoll.closureDate && moment(this.state.strawpoll.closureDate, 'DD/MM/YYYY HH:mm:ss') < moment()) {
        return (
          <div>
            <h2>{ this.state.strawpoll.question }</h2>
            <p>
              The votes are no longer available, you can still check the results
              <Link to={this.link}>
                here
              </Link>
            </p>

          </div>
        ) ;
      }

      const options = this.state.strawpoll.options.map((option) => {
        let type = this.state.strawpoll.multivote ? 'checkbox' : 'radio';
        return (
          <Vote key={option.name} type={type} name={option.name} strawpollId={this.state.strawpoll._id}/>
        );
      });
      return (
        <div>
          <h2>{ this.state.strawpoll.question }</h2>
          <form onSubmit={this.handleSubmit} id={this.state.strawpoll._id} className="form">
            {options}
            <button className="button">Vote</button>
          </form>
          <Link to={this.link}>
            See the results
          </Link>
        </div>
      );
    }
    return (
      <Loader/>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let inputs = e.target.children;
    let elems = document.getElementById(this.state.strawpoll._id).elements;
    let vote = false;
    Array.from(elems).forEach((item) => {
      if (item.type === 'checkbox' || item.type === 'radio') {
        if (item.checked) {
          vote = true;
          Meteor.call('incVoteStrawpoll', this.state.strawpoll._id, item.id);
          switch (this.state.strawpoll.checking) {
            case 'ip':

              break;
            case 'ip':

              break;
            default:

          }
          // this.setState({redirect: true});
        }
      }
    });
    if (vote) {
      Strawpolls.update(
        { _id: this.state.strawpoll._id},
        {$inc: { "total": 1 }}
      );
    }
  };
}
