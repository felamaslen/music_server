/**
 * @file app/reduction.js
 * Sets up the application state at load time
 */

import { Record, fromJS, List } from 'immutable';

export default new Record({
  appState: fromJS({
  }),
  effects: List.of()
});

