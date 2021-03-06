/**
 * @file app/effects-handlers/ApiCallEffectHandler.js
 * Handles API call effects
 */

import buildEffectHandler from '../effectHandlerBuilder';

import {
  urlEncode
} from '../common';

import {
  API_LIST_ARTISTS,
  API_LIST_ALBUMS,
  API_BROWSER_LIST_TRACKS
} from '../constants/effects';

import {
  listArtistsRequested,
  listAlbumsRequested,
  listSongsReceived
} from '../actions/PageBrowserActions';

import axios from 'axios';

export default buildEffectHandler({
  [API_LIST_ARTISTS]: (_, dispatcher) => {
    axios.get('/api/list/artists').then(
      response => dispatcher.dispatch(listArtistsRequested({ response: response }))
    ).catch(
      () => dispatcher.dispatch(listArtistsRequested({ response: null }))
    );
  },

  [API_LIST_ALBUMS]: (artist, dispatcher) => {
    axios.get('/api/list/artist_albums/'
              + urlEncode(artist)
    ).then(
      response => dispatcher.dispatch(listAlbumsRequested({
        artist: artist,
        response: response
      }))
    ).catch(
      () => dispatcher.dispatch(listAlbumsRequested({
        artist: artist,
        response: null
      }))
    );
  },

  [API_BROWSER_LIST_TRACKS]: (params, dispatcher) => {
    axios.get('/api/list/songs/artists/'
              + urlEncode(params.artist) + '/'
              + urlEncode(params.album)
    ).then(
      response => dispatcher.dispatch(listSongsReceived({
        artist: params.artist,
        album: params.album,
        response: response
      }))
    ).catch(
      () => dispatcher.dispatch(listSongsReceived(null))
    );
  }
});
