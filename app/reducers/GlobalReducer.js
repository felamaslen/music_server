/**
 * @file app/reducers/GlobalReducer.js
 * Takes an action and executes it against the global application state reduction
 */

import {
  APP_PAGE_CHANGED,
  APP_WINDOW_RESIZED,

  BROWSER_LIST_ARTISTS_REQUESTED,
  BROWSER_LIST_ALBUMS_REQUESTED,
  BROWSER_ARTIST_LIST_ITEM_SELECTED
} from '../constants/actions';

import {
  changePage,
  handleWindowResize
} from './AppReducer';

import {
  requestAndInsertListArtists,
  requestAndInsertListAlbums,
  selectArtistListItem
} from './PageBrowserReducer';

export default (reduction, action) => {
  switch (action.type) {
    case APP_PAGE_CHANGED:
      return changePage(reduction, action.payload);
    case APP_WINDOW_RESIZED:
      return handleWindowResize(reduction);

    case BROWSER_LIST_ARTISTS_REQUESTED:
      return requestAndInsertListArtists(reduction, action.payload);
    case BROWSER_LIST_ALBUMS_REQUESTED:
      return requestAndInsertListAlbums(reduction, action.payload);
    case BROWSER_ARTIST_LIST_ITEM_SELECTED:
      return selectArtistListItem(reduction, action.payload);

    default:
      return reduction;
  }
}

