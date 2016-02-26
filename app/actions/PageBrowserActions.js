/**
 * @file app/actions/PageBrowserActions.js
 * Browser (page 1) actions
 */

import buildMessage from '../MessageBuilder';

import {
  BROWSER_LIST_ARTISTS_REQUESTED,
  BROWSER_LIST_ALBUMS_REQUESTED,
  BROWSER_ARTIST_LIST_ITEM_SELECTED,
  BROWSER_TRACK_LIST_ITEM_SELECTED,
  BROWSER_TRACK_LIST_ITEM_PLAYED,
  BROWSER_SONGS_LIST_RECEIVED,
  BROWSER_NEXT_SECTION_SWITCHED_TO
} from '../constants/actions';

export const listArtistsRequested = param =>
  buildMessage(BROWSER_LIST_ARTISTS_REQUESTED, param);

export const listAlbumsRequested = param =>
  buildMessage(BROWSER_LIST_ALBUMS_REQUESTED, param);

export const artistListItemSelected = direction =>
  buildMessage(BROWSER_ARTIST_LIST_ITEM_SELECTED, direction);

export const trackListItemSelected = direction =>
  buildMessage(BROWSER_TRACK_LIST_ITEM_SELECTED, direction);

export const currentTrackListItemPlayed = () =>
  buildMessage(BROWSER_TRACK_LIST_ITEM_PLAYED, {});

export const listSongsReceived = response =>
  buildMessage(BROWSER_SONGS_LIST_RECEIVED, response);

export const nextSectionSwitchedTo = () =>
  buildMessage(BROWSER_NEXT_SECTION_SWITCHED_TO, {});
