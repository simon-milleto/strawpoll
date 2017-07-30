import React from 'react';
import {Tracker} from 'meteor/tracker';
import _ from 'lodash';
import { OutlineModal } from 'boron';
import { Link } from 'react-router-dom'
import ClipboardButton from 'react-clipboard.js';

import { Strawpolls } from './../api/strawpolls';

import Loader from './components/Loader';
import PieChartResult from './components/PieChartResult';
import BarResult from './components/BarResult';

export default class StrawpollResult extends React.Component{

  constructor(props) {
    super(props);
    this.state = {};
    this.shareLink = `http://localhost:3000/${this.props.match.params.id}`;
  }

  componentWillMount() {
    Tracker.autorun(() => {
      let strawpoll = Strawpolls.findOne({ "_id": this.props.match.params.id });
      // let strawpoll = ReactiveMethod.call('sortedByVote', this.props.match.params.id, -1);
      if (strawpoll) {
        strawpoll.options = _.sortBy(strawpoll.options, 'vote').reverse();
        this.setState({strawpoll: strawpoll});
      }
    });
  };

  render(){
    if (this.state.strawpoll) {
      let total = this.state.strawpoll.options.reduce((sum, opt) => {
        return sum + opt.vote;
      }, 0);
      let barResult = this.state.strawpoll.options.map((opt) => {
        let percent = Math.round(((100 * opt.vote)/total) * 100) / 100;
        return (
          <BarResult key={opt.name} option={opt} percent={percent}/>
        );
      });
      return (
        <div>
          <h2>{ this.state.strawpoll.question }</h2>
          <div id="results">
            <PieChartResult options={this.state.strawpoll.options} total={total}/>
            <div className="result">
              {barResult}
              <span>On a total of { total } votes</span>
            </div>
          </div>
          <div className="social">
            <button onClick={this.showModal}>Share link</button>
          </div>
          <OutlineModal ref="modal" className='modal'>
            <div className="container">
              <div className="item--flex">
                <input className="form__input" style={{width: '80%'}} type="text" value={this.shareLink}/>
                  <ClipboardButton data-clipboard-text={this.shareLink} className="no-btn" button-title="I'm a tooltip">
                    <img src="/images/copy.svg" width={35}/>
                  </ClipboardButton>
              </div>
              <button className="btn" onClick={this.hideModal}>Close</button>
            </div>
          </OutlineModal>
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
