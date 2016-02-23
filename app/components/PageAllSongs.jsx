/**
 * @file app/components/PageAllSongs.jsx
 * Lists all of the songs in the database, from where
 * you can play or queue them
 */

import React, { PropTypes } from 'react';
import {} from 'immutable';
import classNames from 'classnames';
import PureControllerView from './PureControllerView';

import {
} from '../actions/PageAllSongsActions';

export default class PageAllSongs extends PureControllerView {
  render() {
    const topLevelClassNames = classNames({
      'page-all-songs': true
    });

    return (
      <div className={topLevelClassNames}>
        <span>Page 2 (all songs)</span>
      </div>
    );
  }
}

PageAllSongs.propTypes = {
};

