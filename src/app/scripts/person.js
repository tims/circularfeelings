import React from 'react'

var Person = React.createClass({
  render() {
    const color = this.props.color;
    const {store} = this.context;
    const state = store.getState().people[color];
    const {position, velocity, mass} = state;
    const barycenter = store.getState().people.barycenter;
    const x = position.x + 800 / 2; // - barycenter.x;
    const y = position.y + 600 / 2; // - barycenter.y
    return <g>
      <circle cx={x} cy={y} r={mass} stroke="black" strokeWidth="4" fill={color} />
    </g>
  }
});
Person.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Person
