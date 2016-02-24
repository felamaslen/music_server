/**
 * @file app/actions/PageBrowserActions.js
 * Browser (page 1) actions
 */

import buildMessage from '../MessageBuilder';

import {
  BROWSER_LIST_ARTISTS_REQUESTED,
  BROWSER_LIST_ALBUMS_REQUESTED,
  BROWSER_ARTIST_LIST_ITEM_SELECTED
} from '../constants/actions';

export const listArtistsRequested = param =>
  buildMessage(BROWSER_LIST_ARTISTS_REQUESTED, param);

export const listAlbumsRequested = param =>
  buildMessage(BROWSER_LIST_ALBUMS_REQUESTED, param);

export const artistListItemSelected = direction =>
  buildMessage(BROWSER_ARTIST_LIST_ITEM_SELECTED, direction);


