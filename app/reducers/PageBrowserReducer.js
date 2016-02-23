/**
 * @file app/reducers/PageBrowserReducer.js
 * Browser (page 1) reducers
 */

import { fromJS } from 'immutable';

import buildMessage from '../MessageBuilder';

import {
  API_LIST_ARTISTS
} from '../constants/effects';

export const requestListArtists = reduction => {
  const effects = reduction.get('effects').push(buildMessage(API_LIST_ARTISTS));

  return reduction.set('effects', effects);
}

export const insertListArtists = (reduction, response) => {
  const badResponse = !response || response.status !== 200 || !response.data;

  return badResponse ? reduction : reduction.setIn(
    ['appState', 'browser', 'artists'], fromJS(response.data)
  );
}

