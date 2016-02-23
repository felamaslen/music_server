/**
 * @file app/reduction.js
 * Sets up the application state at load time
 */

import { Record, fromJS, List } from 'immutable';

import {
  startingPage
} from './config';

export default new Record({
  appState: fromJS({
    page: startingPage,
    browser: {
      artists: [],
      albums: {}, // map of artist -> albums (List)
      tracks: []
    }
  }),
  effects: List.of()
});

