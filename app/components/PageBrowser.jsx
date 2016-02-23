/**
 * @file app/components/PageBrowser.jsx
 * Provides a music artist/albums browser from where you can play and
 * queue music
 */

import React, { PropTypes } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';
import PureControllerView from './PureControllerView';

import {
  listArtistsRequested
} from '../actions/PageBrowserActions';

export default class PageBrowser extends PureControllerView {
  componentDidMount() {
    this.dispatchAction(listArtistsRequested());
  }

  render() {
    const topLevelClassNames = classNames({
      'page-browser': true
    });

    const artistsList = this.props.artists.map((artist, index) => {
      return (
        <li key={index}>
          <span className="browser-artist">{artist}</span>
          <ul className="browser-artist-albums"></ul>
        </li>
      );
    });

    return (
      <div className={topLevelClassNames}>
        <div className="artists-list-outer">
          <ul className="artists-list">
            {artistsList}
          </ul>
        </div>
      </div>
    );
  }
}

PageBrowser.propTypes = {
  artists: PropTypes.instanceOf(List)
};

