/**
 * @file app/actions/PlayerActions.js
 * Player actions
 */

import buildMessage from '../MessageBuilder';

import {
  PLAYER_PLAYPAUSE_REQUESTED
} from '../constants/actions';

export const playPauseRequested = () =>
  buildMessage(PLAYER_PLAYPAUSE_REQUESTED, {});


