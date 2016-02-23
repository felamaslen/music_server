/**
 * @file app/effects-handlers/ApiCallEffectHandler.js
 * Handles API call effects
 */

import buildEffectHandler from '../effectHandlerBuilder';

import {
  // API_CALL_DO_SOMETHING
} from '../constants/effects';

export default buildEffectHandler({
  /*
  [API_CALL_DO_SOMETHING]: (query, dispatcher) => {
    axios.get(API_DO_SOMETHING).then(
      response => dispatcher.dispatch(gotSomething(response))
    ).catch(
      () => dispatcher.dispatch(gotSomething(null))
    );
  }
  */
});
