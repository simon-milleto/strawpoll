import React from 'react';
import {Tracker} from 'meteor/tracker';
import {Link, NavLink} from 'react-router-dom'
import FlipMove from 'react-flip-move';
import QueryString from 'query-string';

import {Strawpolls} from './../api/strawpolls';
import history from '../config/history';

import Loader from './components/Loader';
import StrawpollItem from './components/StrawpollItem';
import Pagination from './components/Pagination';

export default class StrawpollsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.strawpollCount = 6;
  }

  componentWillMount() {
    Tracker.autorun(() => {
      const parsed = QueryString.parse(this.props.location.search);
      this.page = parsed.p
        ? parsed.p
        : 1;
      this.fetchStrawpoll(this.props.match.params.sort, this.page);
    });
  };

  componentWillReceiveProps = (props) => {
    const parsed = QueryString.parse(props.location.search);
    this.page = parsed.p
      ? parsed.p
      : 1;
    if (props.match.url !== this.props.match.url) {
      this.fetchStrawpoll(props.match.params.sort, this.page)
    }
  };

  renderStrawpoll = () => {
    if (this.state.strawpolls.length === 0) {
      return <Loader/>;
    } else {
      return this.state.strawpolls.map((strawpoll) => {
        return (<StrawpollItem key={strawpoll._id} strawpoll={strawpoll}/>);
      });
    }
  };

  handleChangePage = (page) => {
    history.push({pathname: `/strawpolls/${this.title.toLowerCase()}`, search: `?p=${page}`})
    this.fetchStrawpoll(this.title.toLowerCase(), page);
  };

  fetchStrawpoll = (sorting, page) => {
    let sort;
    switch (sorting) {
      case 'recent':
        this.title = 'Recent';
        sort = {
          sort: {
            date: -1
          }
        };
        break;
      case 'old':
        this.title = 'Old';
        sort = {
          sort: {
            date: 1
          }
        };
        break;
      case 'popular':
        this.title = 'Popular';
        sort = {
          sort: {
            total: -1
          }
        };
        break;
    }

    sort.limit = this.strawpollCount;
    sort.skip = (this.strawpollCount * page) - this.strawpollCount;
    let strawpolls = Strawpolls.find({}, sort);
    if (strawpolls) {
      this.setState({strawpolls: strawpolls});
    }
  };

  render() {
    const count = Math.ceil(Strawpolls.find().count() / this.strawpollCount);
    const pagination = [];
    for (var i = 1; i <= count; i++) {
      pagination.push(<Pagination key={i} handleChangePage={(page) => {this.handleChangePage(page)}} page={i} current={this.page}/>);
    }
    return (
      <div>
        <h2>
          {this.title} strawpolls
        </h2>
        <div className="item__list">
          <FlipMove duration={500} maintainContainerHeight={true} easing="ease-out">
            {this.renderStrawpoll()}
          </FlipMove>
        </div>
        <div className="pagination">
          {pagination}
        </div>
      </div>
    );
  }
}
