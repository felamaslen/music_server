/**
 * @file app/components/Player.jsx
 * Creates html5 <audio> element to play songs
 */

import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import classNames from 'classnames';
import PureControllerView from './PureControllerView';

import {
  keyMap
} from '../common';

import {
  playPauseRequested,
  playerEventEnded,
  playerEventTimeUpdate
} from '../actions/PlayerActions';

export default class Player extends PureControllerView {
  componentWillMount() {
    window.addEventListener('keydown', event => {
      let preventDefault = true;

      switch (event.keyCode) {
      case keyMap.letter('c'):
        // toggle play/pause
        this._playPause();

        break;
      default:
        preventDefault = false;
      }

      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  componentDidMount() {
    this.refs.audioElem.addEventListener(
      'ended',
      () => this.dispatchAction(playerEventEnded())
    );

    this.refs.audioElem.addEventListener(
      'timeupdate',
      () => this.dispatchAction(playerEventTimeUpdate(
        this.refs.audioElem.currentTime
      ))
    );
  }

  componentWillUpdate(nextProps) {
    const isPlaying = !this.refs.audioElem.paused;

    const shouldBePlaying = nextProps.playing;

    if (isPlaying && !shouldBePlaying) {
      this.refs.audioElem.pause();
    }
    else if (!isPlaying && shouldBePlaying) {
      this.refs.audioElem.play();
    }
  }

  componentDidUpdate(prevProps) {
    const songChanged = prevProps.source !== this.props.source;

    if (songChanged) {
      this.refs.audioElem.load();
      if (this.props.playing) {
        this.refs.audioElem.play();
      }
    }
  }

  _playPause() {
    this.dispatchAction(playPauseRequested());
  }

  render() {
    const topLevelClassNames = classNames({
      'player-engine': true
    });

    return (
      <div id="audio-player-outer" className={topLevelClassNames}>
        <audio ref="audioElem" src={this.props.source}/>
      </div>
    );
  }
}

Player.propTypes = {
  playing:  PropTypes.bool,
  source:   PropTypes.string
};

