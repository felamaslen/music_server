/**
 * @file app/components/PageHandler.jsx
 * Loads different pages
 */

import React, { PropTypes } from 'react';
import { Dispatcher } from 'flux';
import { Map } from 'immutable';
import classNames from 'classnames';
import debounce from 'debounce';
import PureControllerView from './PureControllerView';

import {
  pageIndex
} from '../config';

import {
  keyMap,
  digits
} from '../common';

// load page components
import Player from './Player.jsx';
import StatusBar from './StatusBar.jsx';
import PageBrowser from './PageBrowser.jsx';
import PageAllSongs from './PageAllSongs.jsx';

import {
  pageChanged,
  windowResized
} from '../actions/AppActions';

export default class PageHandler extends PureControllerView {
  componentDidMount() {
    window.addEventListener('keydown', event => {
      const digit = digits.find(_digit => keyMap.number(_digit) === event.keyCode);

      if (typeof digit !== 'undefined') {
        this._changePage(digit);
      }
    });

    window.addEventListener('resize', debounce(() => {
      this.dispatchAction(windowResized());
    }, 200));

    this.dispatchAction(windowResized());
  }

  _changePage(index) {
    this.dispatchAction(pageChanged(index));
  };

  render() {
    const page = this.props.page;

    let pageComponent;

    switch (page) {
      case 'browser':
        pageComponent = (
          <PageBrowser dispatcher={this.props.dispatcher}
            typeFocus={this.props.browser.get('typeFocus')}
            artistsListScroll={this.props.browser.get('artistsListScroll')}
            artists={this.props.browser.get('artists')}
            albums={this.props.browser.get('albums')}
            songs={this.props.browser.get('songs')}
            selectedArtist={this.props.browser.get('selectedArtist')}
            selectedAlbum={this.props.browser.get('selectedAlbum')}
            selectedSong={this.props.browser.get('selectedSong')}
          />
        );

        break;

      case 'allSongs':
        pageComponent = (
          <PageAllSongs dispatcher={this.props.dispatcher}
          />
        );

        break;

      default:
        console.error('Invalid default page set! Check config.js');
    }

    const statusBar = (
      <StatusBar
        allTime={this.props.browser.get('allTime')}
        info={this.props.player.get('info')}
        playing={this.props.player.get('playing')}
        playTime={this.props.player.get('playTime')}
        playPosition={this.props.player.get('playPosition')}
        volume={this.props.player.get('volume')}
      />
    );

    const player = (
      <Player dispatcher={this.props.dispatcher}
        source={this.props.player.get('source')}
        playing={this.props.player.get('playing')}
      />
    );

    return (
      <div id="page-outer">
        {player}
        {pageComponent}
        {statusBar}
      </div>
    );
  }
}

PageHandler.propTypes = {
  browser:    PropTypes.instanceOf(Map),
  dispatcher: PropTypes.instanceOf(Dispatcher),
  page:       PropTypes.string,
  player:     PropTypes.instanceOf(Map)
};

