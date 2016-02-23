/**
 * @file app/components/App.jsx
 * Builds the main application by running the actions (via globalReducer)
 * and loading other components
 */

import { } from 'immutable';
import React, { Component } from 'react';
import { Dispatcher } from 'flux';

import globalReducer from '../reducers/GlobalReducer';

import {
} from '../actions/AppActions';

// load other components
import PageBrowser from './PageBrowser.jsx';

import apiCallEffectHandler from '../effects-handlers/ApiCallEffectHandler';

import Reduction from '../reduction';

export default class App extends Component {
  constructor(props) {
    super(props);

    const dispatcher = new Dispatcher();

    dispatcher.register(action => {
      let reduction = this.state.reduction;

      reduction = reduction.set('effects', List.of());

      reduction = globalReducer(reduction, action);

      reduction.get('effects').forEach(apiCallEffectHandler.bind(null, dispatcher));

      this.setState({reduction});
    });

    this.state = {
      dispatcher: dispatcher,
      reduction:  new Reduction()
    };
  }

  render() {
    const page = (
      <PageBrowser dispatcher={this.state.dispatcher}
      />
    );

    return (
      <main>
        <div id="pages">
          {page}
        </div>
      </main>
    );
  }
}

