import { } from 'immutable';
import React, { Component } from 'react';
import { Dispatcher } from 'flux';

import globalReducer from '../reducers/GlobalReducer';

import {
} from '../actions/AppActions';

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
        Nothing here yet
      </main>
    );
  }
}

