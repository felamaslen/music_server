/**
 * @file app/config.js
 * Defines global configuration variables
 */

// map indexes to pages (for switching)
export const pageIndex = {
  1: 'browser',
  2: 'allSongs'
};

export const startingPage = 'browser';

// text line height - set this in the body {} of CSS too
export const lineHeight = 21;

// number of lines to scroll when pressing page up/down
export const numPageLines = 10;

// for status bar
export const stoppedIcon  = '.';
export const pausedIcon   = '|';
export const playingIcon  = '>';
