import Moment from 'moment'

const init_state = {
  mouse: {
    isDown: false
  },
  position: {
    x: 0,
    y: 0
  }
};

export default function input(state = init_state, action) {
  switch (action.type) {
    case 'Input.mouse':
      return {
        mouse: { isDown: action.isDown, position: action.position }
      };
    default:
      return state;
  }
}
