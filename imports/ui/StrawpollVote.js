import {Meteor} from 'meteor/meteor';
import {Cookies} from 'meteor/ostrio:cookies';
import {Tracker} from 'meteor/tracker';
import {HTTP} from 'meteor/http'
import React from 'react';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom'
import {WaveModal} from 'boron';
import {Strawpolls} from './../api/strawpolls';

import Loader from './components/Loader';
import Vote from './components/Vote';

export default class StrawpollVote extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
    this.link = `/${this.props.match.params.id}/result`
    this.cookies = new Cookies();
  }

  componentWillMount() {
    this.c = Tracker.autorun(() => {
      const strawpoll = Strawpolls.findOne({"_id": this.props.match.params.id});
      this.setState({strawpoll: strawpoll});
    })
  };

  componentWillUnmount() {
    this.c.stop()
  };

  render() {
    const {redirect} = this.state;

    if (redirect) {
      let route = `/${this.props.match.params.id}/result`
      return <Redirect to={route}/>;
    }

    if (this.state.strawpoll) {

      if (this.state.strawpoll.closureDate && moment(this.state.strawpoll.closureDate, 'DD/MM/YYYY HH:mm:ss') < moment()) {
        return (
          <div>
            <h2>{this.state.strawpoll.question}</h2>
            <p>
              The votes are no longer available, you can still check the results
              <Link to={this.link}>
                here
              </Link>
            </p>

          </div>
        );
      }

      const options = this.state.strawpoll.options.map((option) => {
        let type = this.state.strawpoll.multivote
          ? 'checkbox'
          : 'radio';
        return (<Vote key={option.name} type={type} name={option.name} strawpollId={this.state.strawpoll._id}/>);
      });
      return (
        <div>
          <h2>{this.state.strawpoll.question}</h2>
          <form onSubmit={this.handleSubmit} id={this.state.strawpoll._id} className="form">
            {options}
            <button className="button">Vote</button>
          </form>
          <Link to={this.link}>
            See the results
          </Link>
          <WaveModal ref="modal" className='modal'>
            <div className="container">
              <h2 className="message--alert">You have already vote for this strawpoll</h2>
              <button className="btn btn--alert" onClick={this.hideModal}>Close</button>
            </div>
          </WaveModal>
        </div>
      );
    }
    return (<Loader/>);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let inputs = e.target.children;
    let elems = document.getElementById(this.state.strawpoll._id).elements;
    let vote = false;
    Array.from(elems).forEach((item) => {
      if (item.type === 'checkbox' || item.type === 'radio') {
        if (item.checked) {
          switch (this.state.strawpoll.checking) {
            case 'cookie':
              if (this.cookies.has('polls')) {
                const cookie = this.cookies.get('polls');
                if (!cookie.includes(this.state.strawpoll._id)) {
                  this.cookies.set('polls', cookie + '&' + this.state.strawpoll._id);
                } else {
                  this.showModal();
                  return false;
                }
              } else {
                this.cookies.set('polls', this.state.strawpoll._id);
              }
              vote = true;
              Meteor.call('incVoteStrawpoll', this.state.strawpoll._id, item.id);
              break;
            case 'ip':
              HTTP.call('GET', 'https://freegeoip.net/json/', {}, (error, result) => {
                const data = result.data;
                if (!this.state.strawpoll.ipCheck || (this.state.strawpoll.ipCheck.length > 0 && !this.state.strawpoll.ipCheck.includes(data.ip))) {
                  Strawpolls.update({
                    _id: this.state.strawpoll._id
                  }, {
                    $push: {
                      ipCheck: {
                        $each: [data.ip]
                      }
                    }
                  }, {upsert: true});
                  vote = true;
                  Meteor.call('incVoteStrawpoll', this.state.strawpoll._id, item.id);
                } else {
                  this.showModal();
                  return false;
                }
              });
              break;
            case 'unable':
              vote = true;
              Meteor.call('incVoteStrawpoll', this.state.strawpoll._id, item.id);
              break;
          }
          // this.setState({redirect: true});
        }
      }
    });
    if (vote) {
      Strawpolls.update({
        _id: this.state.strawpoll._id
      }, {
        $inc: {
          "total": 1
        }
      });
    }
  };

  showModal = () => {
    this.refs.modal.show();
  };

  hideModal = () => {
    this.refs.modal.hide();
  };
}
