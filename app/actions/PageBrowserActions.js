/**
 * @file app/actions/PageBrowserActions.js
 * Browser (page 1) actions
 */

import buildMessage from '../MessageBuilder';

import {
  BROWSER_LIST_ARTISTS_REQUESTED,
  BROWSER_LIST_ALBUMS_REQUESTED,
  BROWSER_ARTIST_LIST_ITEM_SELECTED,
  BROWSER_SONGS_LIST_RECEIVED
} from '../constants/actions';

export const listArtistsRequested = param =>
  buildMessage(BROWSER_LIST_ARTISTS_REQUESTED, param);

export const listAlbumsRequested = param =>
  buildMessage(BROWSER_LIST_ALBUMS_REQUESTED, param);

export const artistListItemSelected = direction =>
  buildMessage(BROWSER_ARTIST_LIST_ITEM_SELECTED, direction);

export const listSongsReceived = response =>
  buildMessage(BROWSER_SONGS_LIST_RECEIVED, response);
