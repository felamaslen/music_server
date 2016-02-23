/**
 * @file app/reducers/GlobalReducer.js
 * Takes an action and executes it against the global application state reduction
 */

import {
  APP_PAGE_CHANGED
} from '../constants/actions';

import {
  changePage
} from './AppReducer';

export default (reduction, action) => {
  switch (action.type) {
    case APP_PAGE_CHANGED:
      return changePage(reduction, action.payload);
    default:
      return reduction;
  }
}

