import React from 'react'
import Moment from 'moment'

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

var Input = React.createClass({
  componentDidMount() {
    this.downEvents = {}
  },

  componentWillUnmount() {
    for (let unsubscribe of this.listeners) {
      unsubscribe();
    }
  },

  handleMouseInput(event) {
    const {store} = this.context;

    console.log(event);
    const parentPosition = getPosition(event.currentTarget);
    const position = {
      x: event.clientX - parentPosition.x - 800/2,
      y: event.clientY - parentPosition.y - 600/2
    };
    console.log(position);
    switch (event.type) {
      case 'mousedown':
        store.dispatch({type: 'Input.mouse', isDown: true, position:position});
        break;
      case 'mouseup':
        store.dispatch({type: 'Input.mouse', isDown: false, position:position});
        break;
      default:
        return;
    }
  },

  render() {
    const {store} = this.context;
    const {input} = store.getState()

    return <div onMouseDown={this.handleMouseInput}
                onMouseUp={this.handleMouseInput}>
      {this.props.children}
    </div>;
  }
});
Input.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Input
