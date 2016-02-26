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
  eventHandlerStored
} from '../actions/AppActions';

import {
  listArtistsRequested,
  listAlbumsRequested,
  artistListItemSelected,
  trackListItemSelected,
  nextSectionSwitchedTo,
  currentTrackListItemPlayed
} from '../actions/PageBrowserActions';

export default class PageBrowser extends PureControllerView {
  componentDidMount() {
    const hasMountedBefore = this.props.artists.size > 0; // TODO: dedicated state value / action

    if (!hasMountedBefore) {
      this.dispatchAction(listArtistsRequested({}));
    }

    this.dispatchNext(eventHandlerStored({
      name: 'BrowserKeydown',
      func: this._keydownEvent.bind(this)
    }));
  }

  componentWillUnmount() {
    // remove all events bound to window, before unmounting
    window.removeEventListener('keydown', this.props.events.get(0), false);

    this.dispatchNext(eventHandlerStored({
      name: 'BrowserKeydown',
      func: null
    }));
  }

  componentDidUpdate(prevProps) {
    const prevEventKeydown = prevProps.events.get(0);
    const nextEventKeydown = this.props.events.get(0);

    if (!prevEventKeydown && !!nextEventKeydown) {
      window.addEventListener('keydown', this.props.events.get(0), false);
    }

    this.refs.artistsList.scrollTop = lineHeight * this.props.artistsListScroll;
  }

  _keydownEvent(event) {
    let preventDefault = true;

    if (event.keyCode === keyMap.tab) {
      // switch active section
      this._switchToNextSection();
    }
    else {
      switch (this.props.typeFocus) {
      case 'artistsList':
        switch (event.keyCode) {
        case keyMap.space:
          this._toggleArtistAlbums();
          break;
        default:
          if (!this._selectArtistListItem(keyUpOrDown(event.keyCode))) {
            preventDefault = false;
          }
        }
        break;
      case 'trackList':
        switch (event.keyCode) {
        case keyMap.enter:
          // play the song
          this._playCurrentTrackListItem();
          break;
        default:
          if (!this._selectTrackListItem(keyUpOrDown(event.keyCode))) {
            preventDefault = false;
          }
        }
        break;
      default:
        preventDefault = false;
      }
    }

    if (preventDefault) {
      event.preventDefault();
    }
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

  _selectArtistListItem(direction) {
    if (direction !== 0) {
      this.dispatchAction(artistListItemSelected(direction));
    }
  }

  _selectTrackListItem(direction) {
    if (direction !== 0) {
      this.dispatchAction(trackListItemSelected(direction));
    }
  }

  _toggleArtistAlbums(artist) {
    this.dispatchAction(listAlbumsRequested({
      toggleHidden: true
    }));
  }

  _switchToNextSection() {
    // switches focus to the next section (e.g. artist list -> track list)
    this.dispatchAction(nextSectionSwitchedTo());
  }

  _playCurrentTrackListItem() {
    this.dispatchAction(currentTrackListItemPlayed());
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
}

PageBrowser.propTypes = {
  albums: PropTypes.instanceOf(Map),
  artists: PropTypes.instanceOf(List),
  artistsListScroll: PropTypes.number,
  events: PropTypes.instanceOf(List),
  selectedAlbum: PropTypes.number,
  selectedArtist: PropTypes.number,
  selectedSong: PropTypes.number,
  songs: PropTypes.instanceOf(List),
  typeFocus: PropTypes.string
};

