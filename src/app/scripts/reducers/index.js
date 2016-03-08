import { combineReducers } from 'redux'

import timer from './timer'
import people from './people'
import input from './input'
import walls from './walls'

export default combineReducers({
  timer,
  people,
  input,
  walls
});
