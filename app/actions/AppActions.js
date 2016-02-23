/**
 * @file app/actions/AppActions
 * Top level actions
 */

import buildMessage from '../MessageBuilder';

import {
  APP_PAGE_CHANGED
} from '../constants/actions';

export const pageChanged = pageIndex => buildMessage(APP_PAGE_CHANGED, pageIndex);
