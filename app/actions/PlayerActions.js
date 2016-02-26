/**
 * @file app/actions/PlayerActions.js
 * Player actions
 */

import buildMessage from '../MessageBuilder';

import {
  PLAYER_PLAYPAUSE_REQUESTED,
  PLAYER_EVENT_ENDED,
  PLAYER_EVENT_TIMEUPDATE
} from '../constants/actions';

export const playPauseRequested = () => buildMessage(PLAYER_PLAYPAUSE_REQUESTED, {});

export const playerEventEnded = () => buildMessage(PLAYER_EVENT_ENDED, {});
export const playerEventTimeUpdate = currentTime => buildMessage(PLAYER_EVENT_TIMEUPDATE, currentTime);

