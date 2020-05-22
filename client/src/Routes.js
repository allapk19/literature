import React from 'react';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom'

export default class Routes extends React.Component {

  render() {
    return (
      <Router>
        <Route path="/:code?" component={App} />
      </Router>
    );
  }
}
