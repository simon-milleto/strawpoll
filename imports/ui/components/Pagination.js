import React from 'react';
import QueryString from 'query-string';

export default class Pagination extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  changePage = () => {
    this.props.handleChangePage(this.props.page);
  }

  render() {
    let active = this.props.current == this.props.page ? 'pagination__single active' : 'pagination__single';
    return (
        <button className={active} onClick={() => { this.changePage() }}>
          {this.props.page}
        </button>
    );
  }
}
