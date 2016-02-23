/**
 * @file app/components/App.jsx
 * Builds the main application by running the actions (via globalReducer)
 * and loading other components
 */

import { List } from 'immutable';
import React, { Component } from 'react';
import { Dispatcher } from 'flux';

import globalReducer from '../reducers/GlobalReducer';

// load other components
import PageHandler from './PageHandler.jsx';

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
    return (
      <main>
        <div id="page-handler-outer">
          <PageHandler dispatcher={this.state.dispatcher}
            page={this.state.reduction.getIn(['appState', 'page'])}
            artistList={this.state.reduction.getIn(['appState', 'browser', 'artists'])}
          />
        </div>
      </main>
    );
  }
}

