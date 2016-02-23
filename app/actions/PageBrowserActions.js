/**
 * @file app/actions/PageBrowserActions.js
 * Browser (page 1) actions
 */

import buildMessage from '../MessageBuilder';

import {
  BROWSER_LIST_ARTISTS_REQUESTED,
  BROWSER_API_LIST_ARTISTS_RECEIVED,
  BROWSER_LIST_ALBUMS_REQUESTED
} from '../constants/actions';

export const listArtistsRequested = () =>
  buildMessage(BROWSER_LIST_ARTISTS_REQUESTED, {});

export const apiReceivedListArtists = response =>
  buildMessage(BROWSER_API_LIST_ARTISTS_RECEIVED, response);

export const listAlbumsRequested = param =>
  buildMessage(BROWSER_LIST_ALBUMS_REQUESTED, param);


