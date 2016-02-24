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

