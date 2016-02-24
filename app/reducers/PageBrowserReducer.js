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

  const toggleHidden = !!param.toggleHidden;

  const artist = toggleHidden ? reduction.getIn(
    ['appState', 'browser', 'artists', reduction.getIn(
      ['appState', 'browser', 'selectedArtist']
    )]
  ) : param.artist;

  if (typeof param.response === 'undefined') {
    // request
    const albums = reduction.getIn(['appState', 'browser', 'albums', artist]);

    let effects = reduction.get('effects');
    if (!albums) {
      // make new AJAX request
      effects = effects.push(buildMessage(API_LIST_ALBUMS, artist));

      newReduction = reduction.set('effects', effects);
    }
    else {
      const currentlyHidden = albums.get('hidden');

      const shouldHide = param.toggleHidden ? !currentlyHidden : false;

      newReduction = reduction.setIn(
        ['appState', 'browser', 'albums', artist, 'hidden'], shouldHide
      );

      // if we're hiding the albums of the currently selected artist,
      // then reset the selectedAlbum index
      if (shouldHide) {
        newReduction = newReduction.setIn(
          ['appState', 'browser', 'selectedAlbum'], -1
        );
      }
    }
  }
  else {
    // response
    const badResponse = !param.response || param.response.status !== 200 ||
      !param.response.data;

    newReduction = badResponse ? reduction : reduction.setIn(
      ['appState', 'browser', 'albums', artist], fromJS({
        hidden: false,
        list: param.response.data
      })
    ).setIn(['appState', 'browser', 'selectedAlbum'], -1);
  }

  return newReduction;
}

const getArtistAlbums = (albums, artist) => {
  const artistAlbums = albums.get(artist);

  return !!artistAlbums && !artistAlbums.get('hidden') ? artistAlbums.get('list') : List.of();
}

export const selectArtistListItem = (reduction, direction) => {
  const artists = reduction.getIn(['appState', 'browser', 'artists']);
  const albums = reduction.getIn(['appState', 'browser', 'albums']);

  const selectedArtist  = reduction.getIn(['appState', 'browser', 'selectedArtist']);
  const selectedAlbum   = reduction.getIn(['appState', 'browser', 'selectedAlbum']);

  let newSelectedArtist = selectedArtist;
  let newSelectedAlbum = selectedAlbum;

  let _albums = getArtistAlbums(albums, artists.get(selectedArtist));

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

        _albums = getArtistAlbums(albums, artists.get(newSelectedArtist));

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

        _albums = getArtistAlbums(albums, artists.get(newSelectedArtist));

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

