/**
 * @file app/actions/AppActions
 * Top level actions
 */

import buildMessage from '../MessageBuilder';

import {
  APP_PAGE_CHANGED,
  APP_WINDOW_RESIZED
} from '../constants/actions';

export const pageChanged = pageIndex => buildMessage(APP_PAGE_CHANGED, pageIndex);

export const windowResized = () => buildMessage(APP_WINDOW_RESIZED, {});

