import React from 'react'
import Person from './person'

var Canvas = React.createClass({
  render() {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();
    const barycenter = state.people.barycenter
    // const {notes, topic, perspective} = state;
    const width = 800;
    const height = 600;
    const dx = (width / 2); //  - barycenter.x
    const dy = (height / 2); // - barycenter.y

    const {interior, exterior} = state.walls;
    return <div>
      <svg height={height} width={width}>
        <Person color="blue" />
        <Person color="yellow" />
          <circle cx={width/2} cy={height/2} r={exterior.radius} stroke="red" strokeWidth="1" fill="None"/>
      </svg>
    </div>;
  }
});
Canvas.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Canvas
