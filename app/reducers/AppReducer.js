/**
 * @file app/reducers/AppReducer.js
 * Top level reducers
 */

import {
  pageIndex
} from '../config';

export const changePage = (reduction, index) => {
  const newPage = pageIndex[index];
  const oldPage = reduction.getIn(['appState', 'page']);

  return typeof newPage !== 'undefined' && newPage !== oldPage ? reduction.setIn(
    ['appState', 'page'], newPage
  ) : reduction;
}

