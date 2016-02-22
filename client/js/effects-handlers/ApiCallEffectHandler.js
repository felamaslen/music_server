import {
  API_SEARCH_SUGGESTIONS,
  API_LIST_ARTISTS,
  API_LIST_SONGS_FROM_BROWSER
} from '../config';

import axios from 'axios';

import {
  SEARCH_SUGGESTIONS_API_CALL,
  BROWSER_ARTISTS_API_CALL,
  LIST_BROWSER_API_CALL
} from '../constants/effects';

import { searchSuggestionsReceived } from '../actions/SearchActions';
import {
  gotListArtists,
  insertBrowserResults
} from '../actions/BrowserActions';

import buildEffectHandler from '../effectHandlerBuilder';

export default buildEffectHandler({
  [SEARCH_SUGGESTIONS_API_CALL]: (query, dispatcher) => {
    axios.get(API_SEARCH_SUGGESTIONS + encodeURIComponent(query.searchValue)).then(
      response => dispatcher.dispatch(searchSuggestionsReceived(response)),
      () => dispatcher.dispatch(searchSuggestionsReceived(null))
    );
  },

  [BROWSER_ARTISTS_API_CALL]: (_, dispatcher) => {
    axios.get(API_LIST_ARTISTS).then(
      response => dispatcher.dispatch(gotListArtists(response))
    ).catch(
      () => dispatcher.dispatch(gotListArtists(null))
    );
  },

  [LIST_BROWSER_API_CALL]: (query, dispatcher) => {
    console.debug('LIST_BROWSER_API_CALL');
    const params = [];
    if (!!query.artists) {
      params.push('artists');
      params.push(query.artists);
    } else {
      params.push('albums');
    }

    if (!!query.albums) {
      params.push(query.albums);
    }

    const queryString = encodeURI(params
      .map(item => encodeURIComponent(item))
      .reduce((r, s) => r + '/' + s)
    );

    console.debug('Starting axios request');
    window.setTimeout(() => {
      axios.get(API_LIST_SONGS_FROM_BROWSER + queryString, {
      params: { artistChanged: !!query.artistChanged ? 'true' : 'false' }
      }).then(
        response => {
          console.debug('API_LIST_SONGS_FROM_BROWSER response');

          dispatcher.dispatch(insertBrowserResults(response));
        }
      ).catch(
        () => dispatcher.dispatch(insertBrowserResults(null))
      );
    }, 0);
  }
});
