/**
 * @file app/components/PageBrowser.jsx
 * Provides a music artist/albums browser from where you can play and
 * queue music
 */

import React, { PropTypes } from 'react';
import { List, Map } from 'immutable';
import classNames from 'classnames';
import PureControllerView from './PureControllerView';

import {
  listArtistsRequested,
  listAlbumsRequested
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
      const artistAlbums = this.props.albums.get(artist);
      const albums = typeof artistAlbums === 'undefined' ? null :
      artistAlbums.map((album, albumIndex) => {
        return (
          <li key={albumIndex} className="browser-album">{album}</li>
        );
      });

      return (
        <li key={index}>
          <span className="browser-artist">{artist}</span>
          <ul className="browser-artist-albums">{albums}</ul>
        </li>
      );
    });

    const trackList = this.props.tracks.map((track, index) => {
      return (
        <li key={index} className="browser-track">{track}</li>
      );
    });

    return (
      <div className={topLevelClassNames}>
        <div className="artists-list-outer">
          <ul className="artists-list">
            {artistsList}
          </ul>
        </div>
        <div className="track-list-outer">
          <ul className="track-list">
            {trackList}
          </ul>
        </div>
      </div>
    );
  }
}

PageBrowser.propTypes = {
  artists: PropTypes.instanceOf(List),
  tracks: PropTypes.instanceOf(List),
  albums: PropTypes.instanceOf(Map)
};

