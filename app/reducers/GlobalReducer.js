/**
 * @file app/reducers/GlobalReducer.js
 * Takes an action and executes it against the global application state reduction
 */

import {
  APP_PAGE_CHANGED,

  BROWSER_LIST_ARTISTS_REQUESTED,
  BROWSER_API_LIST_ARTISTS_RECEIVED,
  BROWSER_LIST_ALBUMS_REQUESTED
} from '../constants/actions';

import {
  changePage
} from './AppReducer';

import {
  requestListArtists,
  insertListArtists,
  requestAndInsertListAlbums,
} from './PageBrowserReducer';

export default (reduction, action) => {
  switch (action.type) {
    case APP_PAGE_CHANGED:
      return changePage(reduction, action.payload);

    case BROWSER_LIST_ARTISTS_REQUESTED:
      return requestListArtists(reduction);
    case BROWSER_API_LIST_ARTISTS_RECEIVED:
      return insertListArtists(reduction, action.payload);
    case BROWSER_LIST_ALBUMS_REQUESTED:
      return requestAndInsertListAlbums(reduction, action.payload);

    default:
      return reduction;
  }
}

