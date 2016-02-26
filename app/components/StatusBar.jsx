/**
 * @file app/components/StatusBar.jsx
 * Displays current song information
 */

import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import classNames from 'classnames';
import PureControllerView from './PureControllerView';

import {
  stoppedIcon,
  pausedIcon,
  playingIcon
} from '../config';

import {
  formatTimeSeconds
} from '../common';

export default class StatusBar extends PureControllerView {
  render() {
    const topLevelClassNames = classNames({
      'player-status-bar': true
    });

    const info = this.props.info;

    const _artist = !!info ? info.get('artist') : null;
    const _album  = !!info ? info.get('album')  : null;
    const _track  = !!info ? info.get('track')  : null;
    const _title  = !!info ? info.get('title')  : null;
    const _date   = !!info ? info.get('date')   : null;

    const artist  = _artist ? <span className="artist">{_artist}</span> : null;
    const album   = _album && _album.length ? <span className="album">{_album}</span> : null;
    const title   = _title ? (
      <span className="title">
        {_track}. {_title}
      </span>
    ) : null;
    const date    = _date ? <span className="date">{_date}</span> : null;

    // player info (volume, position etc.)
    let infoIcon;
    let playPosition;
    let playTime;
    let allTime;
    let volume;

    if (this.props.info === null) {
      // not playing anything
      infoIcon = stoppedIcon;
      playPosition = 0;
      playTime = null;
    }
    else {
      infoIcon = this.props.playing ? playingIcon : pausedIcon;
      playPosition = this.props.playPosition;
      playTime = <span className="info-play-time">{formatTimeSeconds(this.props.playTime)}</span>;
    }

    allTime = <span className="info-alltime">{formatTimeSeconds(this.props.allTime)}</span>;

    volume        = <span className="info-volume">{this.props.volume}</span>;
    infoIcon      = <span className="info-icon">{infoIcon}</span>;
    playPosition  = <span className="info-play-position">{formatTimeSeconds(playPosition)}</span>;

    return (
      <div className={topLevelClassNames}>
        <div className="song-info">
          {artist}
          {album}
          {title}
          {date}
        </div>
        <div className="player-info">
          {infoIcon}
          {playPosition}
          {playTime}
          {allTime}
          {volume}
        </div>
      </div>
    );
  }
}

StatusBar.propTypes = {
  allTime:      PropTypes.number,
  info:         PropTypes.instanceOf(Map),
  playPosition: PropTypes.number,
  playTime:     PropTypes.number,
  playing:      PropTypes.bool,
  volume:       PropTypes.number
};

