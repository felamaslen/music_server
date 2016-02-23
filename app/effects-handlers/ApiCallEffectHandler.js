/**
 * @file app/effects-handlers/ApiCallEffectHandler.js
 * Handles API call effects
 */

import buildEffectHandler from '../effectHandlerBuilder';

import {
  API_LIST_ARTISTS
} from '../constants/effects';

import {
  apiReceivedListArtists
} from '../actions/PageBrowserActions';

import axios from 'axios';

export default buildEffectHandler({
  [API_LIST_ARTISTS]: (_, dispatcher) => {
    axios.get('/api/list/artists').then(
      response => dispatcher.dispatch(apiReceivedListArtists(response))
    ).catch(
      () => dispatcher.dispatch(apiReceivedListArtists(null))
    );
  }
});
