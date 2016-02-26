/**
 * @file app/reducers/PlayerReducer.js
 * Player reducers
 */

export const playPause = reduction =>
  reduction.setIn(['appState', 'player', 'playing'],
                  !reduction.getIn(['appState', 'player', 'playing']));



