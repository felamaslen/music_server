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

  enter:  13,
  space:  32,

  number: digit => digits.findIndex(item => item === digit) + 48,

  letter: character => letters.findIndex(item => item === character) + 65
}


