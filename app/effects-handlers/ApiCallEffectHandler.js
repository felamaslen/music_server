/**
 * @file app/effects-handlers/ApiCallEffectHandler.js
 * Handles API call effects
 */

import buildEffectHandler from '../effectHandlerBuilder';

import {
  API_LIST_ARTISTS,
  API_LIST_ALBUMS
} from '../constants/effects';

import {
  listArtistsRequested,
  listAlbumsRequested
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
    axios.get('/api/list/artist_albums/' + artist).then(
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
  }
});
