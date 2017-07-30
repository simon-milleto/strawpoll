import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import {Tracker} from 'meteor/tracker';
import { BrowserRouter } from "react-router-dom";

import App from './../imports/ui/App';

Meteor.startup(() => {
  Tracker.autorun(() => {
    ReactDOM.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('app'));
    });
  });
