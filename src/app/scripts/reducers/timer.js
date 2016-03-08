import Moment from 'moment'

const init_state = {ticks: 0, moment: Moment()}

export default function timer(state = init_state, action) {
  switch (action.type) {
    case 'Timer.tick':
      return {
        ticks: state.ticks + 1,
        moment: action.moment
      };
      break;
    default:
      return state;
  }
}
