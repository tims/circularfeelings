import React from 'react'
import Canvas from './canvas'
import Timer from './timer'
import Input from './input'

var Root = React.createClass({
  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  },

  componentWillUnmount() {
    this.unsubscribe();
  },

  render() {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();

    return <div>
      <Timer />
      <Input>
        <Canvas />
      </Input>
    </div>;
  }
});
Root.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Root;
