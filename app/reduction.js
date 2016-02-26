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
    app: {
      page: startingPage,
      numLines: 0
    },
    player: {
      source: 'about:blank',
      info: null,
      playing: false
    },
    browser: {
      typeFocus: 'artistsList',
      artistsListScroll: 0,
      artistsListLastScrollDir: 1,
      artists: [],
      albums: {}, // map of artist -> albums (List)
      songs: [],  // list of songs currently visible
      selectedArtist: -1,
      selectedAlbum: -1,
      selectedSong: -1
    }
  }),
  effects: List.of()
});

