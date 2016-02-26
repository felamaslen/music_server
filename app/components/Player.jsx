/**
 * @file app/components/Player.jsx
 * Creates html5 <audio> element to play songs
 */

import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import classNames from 'classnames';
import PureControllerView from './PureControllerView';

import {
} from '../actions/PlayerActions';

export default class Player extends PureControllerView {
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
  source:  PropTypes.string,
  info:     PropTypes.instanceOf(Map)
};

