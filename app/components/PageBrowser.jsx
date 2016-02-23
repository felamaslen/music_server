/**
 * @file app/components/PageBrowser.jsx
 * Provides a music artist/albums browser from where you can play and
 * queue music
 */

import React, { PropTypes } from 'react';
import {} from 'immutable';
import classNames from 'classnames';
import PureControllerView from './PureControllerView';

import {
} from '../actions/PageBrowserActions';

export default class PageBrowser extends PureControllerView {
  render() {
    const topLevelClassNames = classNames({
      'page-browser': true
    });

    return (
      <div className={topLevelClassNames}>
        <span>Page 1 (browser)</span>
      </div>
    );
  }
}

PageBrowser.propTypes = {
};

