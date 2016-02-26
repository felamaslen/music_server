/**
 * @file app/reducers/PlayerReducer.js
 * Player reducers
 */

export const playPause = reduction =>
  reduction.setIn(['appState', 'player', 'playing'],
                  !reduction.getIn(['appState', 'player', 'playing']));

// TODO: make this switch to the next song in the playlist / song list
export const audioEnded = reduction => reduction;

export const audioTimeUpdate = (reduction, currentTime) =>
  reduction.setIn(['appState', 'player', 'playPosition'], Math.round(currentTime));

