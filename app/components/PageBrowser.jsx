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
  keyUpOrDown
} from '../common';

import {
  listArtistsRequested,
  listAlbumsRequested,
  artistListItemSelected
} from '../actions/PageBrowserActions';

export default class PageBrowser extends PureControllerView {
  componentDidMount() {
    this.dispatchAction(listArtistsRequested({}));

    window.addEventListener('keydown', event => {
      this._selectArtistListItem(event, keyUpOrDown(event.keyCode));
    });
  }

  render() {
    const topLevelClassNames = classNames({
      'page-browser': true
    });

    const artistsList = this.props.artists.map((artist, artistIndex) => {
      const artistAlbums = this.props.albums.get(artist);
      const albums = typeof artistAlbums === 'undefined' ? null :
      artistAlbums.map((album, albumIndex) => {
        const liClass = classNames({
          'browser-album': true,
          selected: this.props.selectedAlbum === albumIndex
        });

        return (
          <li key={albumIndex} className={liClass}>{album}</li>
        );
      });

      const liClass = classNames({
        'browser-album': true,
        selected: this.props.selectedArtist === artistIndex
          && this.props.selectedAlbum < 0
      });

      return (
        <li key={artistIndex}>
          <span className={liClass}>{artist}</span>
          <ul className="browser-artist-albums">{albums}</ul>
        </li>
      );
    });

    const trackList = this.props.tracks.map((track, trackIndex) => {
      return (
        <li key={trackIndex} className="browser-track">{track}</li>
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

  _selectArtistListItem(event, direction) {
    if (direction !== 0) {
      event.stopPropagation();
      event.preventDefault();

      this.dispatchAction(artistListItemSelected(direction));
    }
  }
}

PageBrowser.propTypes = {
  artists: PropTypes.instanceOf(List),
  tracks: PropTypes.instanceOf(List),
  albums: PropTypes.instanceOf(Map),
  selectedArtist: PropTypes.number,
  selectedAlbum: PropTypes.number
};

