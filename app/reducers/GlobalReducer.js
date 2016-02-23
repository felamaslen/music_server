/**
 * @file app/reducers/GlobalReducer.js
 * Takes an action and executes it against the global application state reduction
 */

import {
  // APP_SOMETHING_DONE
} from '../constants/actions';

import {
  // doSomething
} from './AppReducer';

export default (reduction, action) => {
  switch (action.type) {
  /*
  case APP_SOMETHING_DONE:
    return doSomething(reduction, action.payload);
  */
  default:
    return reduction;
  }
}
