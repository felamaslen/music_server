/**
 * @file app/reducers/GlobalReducer.js
 * Takes an action and executes it against the global application state reduction
 */

import {
  APP_PAGE_CHANGED,
  APP_WINDOW_RESIZED,

  BROWSER_LIST_ARTISTS_REQUESTED,
  BROWSER_LIST_ALBUMS_REQUESTED,
  BROWSER_ARTIST_LIST_ITEM_SELECTED,
  BROWSER_TRACK_LIST_ITEM_SELECTED,
  BROWSER_SONGS_LIST_RECEIVED,
  BROWSER_NEXT_SECTION_SWITCHED_TO
} from '../constants/actions';

import {
  changePage,
  handleWindowResize
} from './AppReducer';

import {
  insertListSongs,
  requestAndInsertListArtists,
  requestAndInsertListAlbums,
  selectArtistListItem,
  selectTrackListItem,
  switchToNextSection
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
    case BROWSER_TRACK_LIST_ITEM_SELECTED:
      return selectTrackListItem(reduction, action.payload);
    case BROWSER_SONGS_LIST_RECEIVED:
      return insertListSongs(reduction, action.payload);
    case BROWSER_NEXT_SECTION_SWITCHED_TO:
      return switchToNextSection(reduction);

    default:
      return reduction;
  }
}

