/**
 * @file app/reducers/PageBrowserReducer.js
 * Browser (page 1) reducers
 */

import { List, fromJS } from 'immutable';

import buildMessage from '../MessageBuilder';

import {
  API_LIST_ARTISTS,
  API_LIST_ALBUMS
} from '../constants/effects';

export const requestAndInsertListArtists = (reduction, param) => {
  let newReduction;

  const oldArtists = reduction.getIn(['appState', 'browser', 'artists']);

  if (typeof param.response === 'undefined') {
    // request
    const effects = reduction.get('effects').push(buildMessage(API_LIST_ARTISTS));

    newReduction = reduction.set('effects', effects);
  }
  else {
    // response
    const badResponse = !param.response || param.response.status !== 200 ||
      !param.response.data;

    newReduction = badResponse ? reduction : reduction.setIn(
      ['appState', 'browser', 'artists'], fromJS(param.response.data)
    )
    .setIn(['appState', 'browser', 'selectedArtist'], param.response.data.length > 0 ? 0 : -1)
    .setIn(['appState', 'browser', 'selectedAlbum'], -1);
  }

  return newReduction;
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
    ).setIn(['appState', 'browser', 'selectedAlbum'], -1);
  }

  return newReduction;
}

export const selectArtistListItem = (reduction, direction) => {
  const artists = reduction.getIn(['appState', 'browser', 'artists']);
  const albums = reduction.getIn(['appState', 'browser', 'albums']);

  const selectedArtist  = reduction.getIn(['appState', 'browser', 'selectedArtist']);
  const selectedAlbum   = reduction.getIn(['appState', 'browser', 'selectedAlbum']);

  let newSelectedArtist = selectedArtist;
  let newSelectedAlbum = selectedAlbum;

  let _albums = albums.get(artists.get(selectedArtist)) || List.of();
  let steps = 0;
  const numSteps = Math.abs(direction);
  const dir = direction < 0 ? -1 : 1;

  while (steps < numSteps) {
    if (dir < 0) {
      if (newSelectedAlbum > -1) {
        newSelectedAlbum--;
      }
      else {
        if (newSelectedArtist === 0) {
          break;
        }

        newSelectedArtist--;

        _albums = albums.get(artists.get(newSelectedArtist)) || List.of();

        newSelectedAlbum = _albums.size - 1;
      }
    }
    else {
      if (newSelectedAlbum < _albums.size - 1) {
        newSelectedAlbum++;
      }
      else {
        if (newSelectedArtist === artists.size - 1) {
          break;
        }

        newSelectedArtist++;

        _albums = albums.get(artists.get(newSelectedArtist)) || List.of();

        newSelectedAlbum = -1;
      }
    }

    steps++;
  }

  return reduction
    .setIn(['appState', 'browser', 'selectedArtist'], newSelectedArtist)
    .setIn(['appState', 'browser', 'selectedAlbum'], newSelectedAlbum)
  ;
}

