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
  lineHeight
} from '../config';

import {
  keyUpOrDown,
  keyMap,
  formatLeadingZeros,
  formatTimeSeconds
} from '../common';

import {
  listArtistsRequested,
  listAlbumsRequested,
  artistListItemSelected,
  trackListItemSelected,
  nextSectionSwitchedTo
} from '../actions/PageBrowserActions';

export default class PageBrowser extends PureControllerView {
  componentDidMount() {
    this.dispatchAction(listArtistsRequested({}));

    window.addEventListener('keydown', event => {
      if (event.keyCode === keyMap.tab) {
        // switch active section
        this._switchToNextSection(event);
      }
      else {
        switch (this.props.typeFocus) {
        case 'artistsList':
          if (event.keyCode === keyMap.space) {
            this._toggleArtistAlbums(event);
          }
          else {
            this._selectArtistListItem(event, keyUpOrDown(event.keyCode));
          }
          break;
        case 'trackList':
          this._selectTrackListItem(event, keyUpOrDown(event.keyCode));
          break;
        default:
        }
      }
    });
  }

  componentDidUpdate() {
    this.refs.artistsList.scrollTop = lineHeight * this.props.artistsListScroll;
  }

  _renderArtistList() {
    return this.props.artists.map((artist, artistIndex) => {
      let albums = null;

      const artistAlbums = this.props.albums.get(artist);

      if (typeof artistAlbums !== 'undefined' && !artistAlbums.get('hidden')) {
        const artistSelected = this.props.selectedArtist === artistIndex;

        let _albums = artistAlbums.get('list');

        albums = _albums.map((album, albumIndex) => {
          const liClass = classNames({
            'browser-album': true,
            selected: artistSelected && this.props.selectedAlbum === albumIndex
          });

          return (
            <li key={albumIndex} className={liClass}>{album}</li>
          );
        });

      }

      const liClass = classNames({
        'browser-artist': true,
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
  }

  _renderTrackList() {
    return this.props.songs.map((track, trackIndex) => {
      return (
        <li key={trackIndex} className={classNames({
          'browser-track': true,
          selected: this.props.selectedSong === trackIndex
        })}>
          <span className="track-tracknumber">{formatLeadingZeros(track.get(1))}.</span>
          <span className="track-title">{track.get(2)}</span>
          <span className="track-date">{track.get(7)}</span>
          <span className="track-time">{formatTimeSeconds(track.get(3))}</span>
        </li>
      );
    });
  }

  render() {
    const topLevelClassNames = classNames({
      page: true,
      'page-browser': true
    });

    const artistsList = this._renderArtistList();

    const trackList = this._renderTrackList();

    return (
      <div className={topLevelClassNames}>
        <div className={classNames({
          'artists-list-outer': true,
          active: this.props.typeFocus === 'artistsList'
        })} ref="artistsList">
          <ul className="artists-list">
            {artistsList}
          </ul>
        </div>
        <div className={classNames({
          'track-list-outer': true,
          active: this.props.typeFocus === 'trackList'
        })}>
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

  _selectTrackListItem(event, direction) {
    if (direction !== 0) {
      event.stopPropagation();
      event.preventDefault();

      this.dispatchAction(trackListItemSelected(direction));
    }
  }

  _toggleArtistAlbums(artist) {
    event.stopPropagation();
    event.preventDefault();

    this.dispatchAction(listAlbumsRequested({
      toggleHidden: true
    }));
  }

  _switchToNextSection(event) {
    // switches focus to the next section (e.g. artist list -> track list)
    this.dispatchAction(nextSectionSwitchedTo());
    event.preventDefault();
  }
}

PageBrowser.propTypes = {
  selectedArtist: PropTypes.number,
  selectedAlbum: PropTypes.number,
  selectedSong: PropTypes.number,
  artistsListScroll: PropTypes.number,
  typeFocus: PropTypes.string,
  artists: PropTypes.instanceOf(List),
  songs: PropTypes.instanceOf(List),
  albums: PropTypes.instanceOf(Map)
};

