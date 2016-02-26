/**
 * @file app/components/PageHandler.jsx
 * Loads different pages
 */

import React, { PropTypes } from 'react';
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

    const player = (
      <Player dispatcher={this.props.dispatcher}
        source={this.props.player.get('source')}
        info={this.props.player.get('info')}
        playing={this.props.player.get('playing')}
      />
    );

    return (
      <div id="page-outer">
        {player}
        {pageComponent}
      </div>
    );
  }

  _changePage(index) {
    this.dispatchAction(pageChanged(index));
  };

}

PageHandler.propTypes = {
  page: PropTypes.string,
  player:   PropTypes.instanceOf(Map),
  browser:  PropTypes.instanceOf(Map)
};

