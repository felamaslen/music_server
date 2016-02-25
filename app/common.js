/**
 * @file app/common.js
 * Defines common methods and static variables
 */

import { List } from 'immutable';

export const letters = List.of(
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
);

export const digits = List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);

export const keyMap = {
  // arrows
  left:   37,
  up:     38,
  right:  39,
  down:   40,

  pgup:   33,
  pgdown: 34,

  enter:  13,
  space:  32,

  number: digit => digits.findIndex(item => item === digit) + 48,

  letter: character => letters.findIndex(item => item === character) + 65
}

export const keyUpOrDown = keyCode => {
  const down = keyMap.down === keyCode;
  const up   = keyMap.up   === keyCode;

  const pgdown  = keyMap.pgdown === keyCode;
  const pgup    = keyMap.pgup   === keyCode;

  let j, k = false;
  if (!down && !up) {
    j = keyMap.letter('j') === keyCode;
    k = keyMap.letter('k') === keyCode;
  }

  j = j || down || pgdown;
  k = k || up   || pgup;

  return (j ? 1 : (k ? -1 : 0)) * (pgdown || pgup ? 5 : 1);
}

export const calculateScrollOffset = reduction => {
  const artists = reduction.getIn(['appState', 'browser', 'artists']);
  const albums  = reduction.getIn(['appState', 'browser', 'albums']);

  const artistKey = reduction.getIn(['appState', 'browser', 'selectedArtist']);
  const albumKey  = reduction.getIn(['appState', 'browser', 'selectedAlbum']);

  const dir = reduction.getIn(
    ['appState', 'browser', 'artistsListLastScrollDir']
  );

  const currentScrollLines = reduction.getIn(
    ['appState', 'browser', 'artistsListScroll']
  );

  // number of lines that can fit in the current window size
  const numLines = reduction.getIn(['appState', 'app', 'numLines']);

  let newReduction = reduction;

  let offsetTop = -1;

  artists.slice(0, artistKey + 1).forEach((artist, key) => {
    offsetTop++;

    if (key < artistKey) {
      const thisArtistAlbums = albums.get(artist);

      offsetTop += (thisArtistAlbums && !thisArtistAlbums.get('hidden')
                    ? thisArtistAlbums.get('list').size : 0);
    }
  });

  offsetTop += albumKey + 1;

  if (dir > 0) {
    // was scrolling down
    const numLinesAfter = numLines + currentScrollLines - offsetTop;

    // console.debug('numLinesAfter', numLinesAfter, offsetTop)

    if (numLinesAfter < 4) {
      const newScroll = offsetTop - numLines + 4;

      newReduction = newReduction.setIn(
        ['appState', 'browser', 'artistsListScroll'],
        newScroll
      );
    }
  }
  else {
    // was scrolling up
    const numLinesBefore = offsetTop - currentScrollLines;

    if (numLinesBefore < 4) {
      // scroll up
      newReduction = newReduction.setIn(
        ['appState', 'browser', 'artistsListScroll'],
        Math.max(0, offsetTop - 4)
      );
    }
  }

  return newReduction;
}

export const formatLeadingZeros = number =>
  number < 10 ? (number === 0 ? '00' : '0' + number.toString())
    : number.toString();

export const formatTimeSeconds = _seconds => {
  let components = [];

  const hours = Math.floor(_seconds / 3600);
  if (hours > 0) {
    components.push(hours);
  }

  const minutes = formatLeadingZeros(Math.floor((_seconds % 3600) / 60));
  const seconds = formatLeadingZeros(_seconds % 60);

  components.push(minutes);
  components.push(seconds);

  return components.join(':');
}

