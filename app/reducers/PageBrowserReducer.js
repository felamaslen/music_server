/**
 * @file app/reducers/PageBrowserReducer.js
 * Browser (page 1) reducers
 */

import { fromJS } from 'immutable';

import buildMessage from '../MessageBuilder';

import {
  API_LIST_ARTISTS,
  API_LIST_ALBUMS
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

export const requestAndInsertListAlbums = (reduction, param) => {
  let newReduction;

  if (typeof param.response === 'undefined') {
    // request
    const effects = reduction.get('effects').push(buildMessage(API_LIST_ALBUMS, param.artist));

    newReduction = reduction.set('effects', effects);
  }
  else {
    // response
    const badResponse = !param.response || param.response.status !== 200 ||
      !param.response.data;

    newReduction = badResponse ? reduction : reduction.setIn(
      ['appState', 'browser', 'albums', param.artist], fromJS(param.response.data)
    );
  }

  return newReduction;
}
