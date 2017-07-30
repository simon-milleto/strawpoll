import React from 'react';
import createBrowserHistory from 'history/createBrowserHistory'
import { Redirect } from 'react-router';
import { Strawpolls } from './../api/strawpolls';
import history from '../config/history';
import { COLORS } from '../config/constants';
import { WaveModal } from 'boron';


import Answer from './Answer';

export default class CreatePoll extends React.Component{
  state = {
    redirect: false
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.answers = [
      {
        key: 1
      },
      {
        key: 2
      },
      {
        key: 3
      },
    ];
    this.strawpoll;
  }

  render(){
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to={this.strawpoll}/>;
    }

    return (
      <div className="item">
        <form onSubmit={this.handleSubmit} className="form" id="createPoll">
          <input className="form__input" type="text" name="question" placeholder="Question" ref="question"/>
          {
            this.answers.map((item) => (
              <Answer key={item.key} handleChange={this.handleChange} />
            ))
          }
          <div className="form__group">
            <input id="multi" type="checkbox" value="multi" name="multi" ref="multi"/>
            <label className="form__label" htmlFor="multi">Allow multiple poll answers</label>
          </div>
          <button className="button">Create Poll</button>
        </form>
        <WaveModal ref="modal" className='modal'>
          <div className="container">
            <h2 className="message--alert">{this.state.message}</h2>
            <button className="btn btn--alert" onClick={this.hideModal}>Close</button>
          </div>
        </WaveModal>
      </div>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let inputs = e.target.children;
    const strawpoll = this.createStrawpoll(inputs);
    if (strawpoll.question && strawpoll.options) {
      Strawpolls.insert(strawpoll, (err, inserted) => {
        this.strawpoll = `/${inserted}`;
        this.setState({ redirect: true })
      });
    }
  };

  createStrawpoll = (inputs) => {
    let options = [];
    Array.from(inputs).forEach((item) => {
      if (item.value) {
        if (item.name === 'answer') {
          options.push({
            name: item.value,
            vote: 0,
            color: this.getAvailableColor(options)
          });
        }
      }
    });
    if (!this.refs.question.value.length) {
      this.message = 'Wait ! You can\'t create a strawpoll without question !';
      this.setState({message: this.message});
      this.showModal();
      return false;
    }
    if (options.length < 2) {
      this.message = 'You need answers if you want that we answer to your question!';
      this.setState({message: this.message});
      this.showModal();
      return false;
    }
    return strawpoll = {
      question: this.refs.question.value,
      options: options,
      multivote: this.refs.multi.checked,
      date: moment().format('DD/MM/YYYY HH:mm:ss'),
      total: 0
    };
  };

  handleChange = (e) => {
    let inputs = document.getElementsByClassName('form__input--title');
    let addInput = true;
    Array.from(inputs).forEach((item) => {
      if(!item.value){
        addInput = false;
      }
    });
    if(addInput) {
      this.addInput()
    }
  };

  addInput = () => {
    let answer = {
      key: this.answers.length + 1,
      name: `answer_${this.answers.length + 1}`,
    };
    this.answers.push(answer);
    this.forceUpdate();
  };

  getAvailableColor = (options) => {
    let colors = options.map(function (option) {
      return option.color;
    });

    return COLORS.find(function (c) {
      if (!colors.includes(c)) {
        return c;
      }
    });
  }

  showModal = () => {
    this.refs.modal.show();
  };

  hideModal = () => {
    this.refs.modal.hide();
  };

}
