import _ from 'lodash';
document._ = _;

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'

import Root from './scripts/root'
import reducer from './scripts/reducers/index'
import action_getstate from './scripts/middleware/action_getstate'

function assign(obj1, obj2) {
  console.log('assign')
  console.log(obj1)
  console.log(obj2)
  return Object.assign({}, obj1, obj2)
}

var render = () => {
  ReactDOM.render(
    <Provider store={createStore(reducer, applyMiddleware(action_getstate))}>
      <Root />
    </Provider>,
    document.getElementById('root')
  );
}

window.onload = () => {
  render();
};
