import React from 'react'
import Moment from 'moment'

const INTERVAL = 13;
var Timer = React.createClass({
  componentDidMount() {
    const {store} = this.context;
    this.ticker = setInterval(this.tick, INTERVAL);
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  },

  componentWillUnmount() {
    clearInterval(this.ticker);
    this.unsubscribe();
  },

  tick() {
    const store = this.context.store
    store.dispatch({
      type: 'Timer.tick',
      moment: Moment()
    });
    if (store.getState().timer.ticks > 10) {
      // clearInterval(this.ticker);
    }
  },

  render() {
    const {store} = this.context;
    const {timer} = store.getState()

    return <div>{timer.ticks} :: {timer.moment.format('x')}</div>
  }
});
Timer.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Timer
