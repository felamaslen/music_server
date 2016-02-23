/**
 * @file app/components/PageHandler.jsx
 * Loads different pages
 */

import React, { PropTypes } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';
import PureControllerView from './PureControllerView';

import {
  pageIndex
} from '../config';

import {
  keyMap,
  digits
} from '../common';

// load page components
import PageBrowser from './PageBrowser.jsx';
import PageAllSongs from './PageAllSongs.jsx';

import {
  pageChanged
} from '../actions/AppActions';

export default class PageHandler extends PureControllerView {
  componentDidMount() {
    window.addEventListener('keydown', event => {
      const digit = digits.find(_digit => keyMap.number(_digit) === event.keyCode);

      if (typeof digit !== 'undefined') {
        this._changePage(digit);
      }
    });
  }

  render() {
    const page = this.props.page;

    let pageComponent;

    switch (page) {
      case 'browser':
        pageComponent = (
          <PageBrowser dispatcher={this.props.dispatcher}
            artists={this.props.artistList}
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

    return (
      <div id="page-outer">
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
  artistList: PropTypes.instanceOf(List)
};

