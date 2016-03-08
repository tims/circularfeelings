// Allow composed reducers to get the whole store state from the action.
export default store => next => action => {
  next(Object.assign({}, action, { getState: store.getState }));
}
