/**
 * @file app/reducers/AppReducer.js
 * Top level reducers
 */

import {
  pageIndex,
  lineHeight
} from '../config';

export const changePage = (reduction, index) => {
  const newPage = pageIndex[index];
  const oldPage = reduction.getIn(['appState', 'app', 'page']);

  return typeof newPage !== 'undefined' && newPage !== oldPage ? reduction.setIn(
    ['appState', 'app', 'page'], newPage
  ) : reduction;
}

export const handleWindowResize = reduction => {
  const docW = window.innerWidth;
  const docH = window.innerHeight;

  const numLines = Math.floor(docH / lineHeight);

  return reduction
    .setIn(['appState', 'app', 'numLines'], numLines)
  ;
}

export const storeEventHandler = (reduction, handler) => {
  return reduction
    .setIn(['appState', 'eventHandlers', handler.name], handler.func)
  ;
}

