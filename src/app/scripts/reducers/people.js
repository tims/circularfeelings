const init_state = {
  barycenter: {
    x: 0,
    y: 0
  },
  blue: {
    mass: 10,
    position: {
      x: 0,
      y: -150.0,
      updated_at: null
    },
    velocity: {
      x: -0.05,
      y: 0.0
    },
    force_vector: {
      x: 0,
      y: 0
    },
    color: 'blue'
  },
  yellow: {
    mass: 10,
    position: {
      x: 0.0,
      y: 150.0,
      updated_at: null
    },
    velocity: {
      x: 0.05,
      y: 0.0
    },
    force_vector: {
      x: 0,
      y: 0
    },
    color: 'yellow'
  }
}

const GRAVITATION_CONSTANT = 0.2;
function calc_force(person1, person2) {
  // Calc force vector that person1 exerts on person2
  const diff = subtract(person1.position,  person2.position);
  var distance_squared = diff.x * diff.x + diff.y * diff.y; // don't take sqrt
  if (distance_squared < 1) {
    distance_squared = 1;
  }
  const distance = Math.sqrt(distance_squared);
  const total_mass = person1.mass * person2.mass;
  const force = GRAVITATION_CONSTANT * total_mass / distance_squared;
  const unit_vector = {
    x: (diff.x / distance),
    y: (diff.y / distance)
  }
  const force_vector = {
    x: force * unit_vector.x,
    y: force * unit_vector.y
  }
  return force_vector;
}

function processForce(state, action) {
  return Object.assign({}, state, {
    'yellow': Object.assign({}, state['yellow'], {
      force_vector: calc_force(state['blue'], state['yellow'])
    }),
    'blue': Object.assign({}, state['blue'], {
      force_vector: calc_force(state['yellow'], state['blue'])
    })
  });
}


function subtract(vector1, vector2) {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y
  }
}

function move_person(person, action) {
  const {position, velocity, force_vector} = person;
  const {moment} = action

  if (position.updated_at === null) {
    return Object.assign({}, person, {
      position: Object.assign({}, position, {updated_at: moment})
    });
  }

  const time = moment - position.updated_at;
  var new_velocity = {
    x: velocity.x + (force_vector.x / person.mass) * time,
    y: velocity.y + (force_vector.y / person.mass) * time
  }
  const norm = distance(new_velocity, {x:0, y:0});
  const speed_limit = 1;
  if (norm > speed_limit) {
    new_velocity = multiply(normalize(new_velocity), speed_limit);
  }

  const new_position = {
    x: position.x + new_velocity.x * time,
    y: position.y + new_velocity.y * time,
    updated_at: moment
  }
  return {
    mass: person.mass,
    position: new_position,
    velocity: new_velocity,
    color: person.color,
    force_vector: force_vector
  }
}

function process_input(state, input) {
  if (!(input.mouse||{}).isDown) {
    return state;
  }

  if (input.mouse.position.x < 0) {
    const new_mass = state['blue'].mass + 0.1;
    return {
      'yellow': state['yellow'],
      'blue': Object.assign({}, state['blue'], {
        mass: new_mass
      })
    };
  } else {
    const new_mass = state['yellow'].mass + 0.1;
    return {
      'blue': state['blue'],
      'yellow': Object.assign({}, state['yellow'], {
        mass: new_mass
      })
    };
  }
}

function normalize(vector) {
  const norm = distance(vector, {x:0, y:0});
  return {
    x: vector.x / norm,
    y: vector.y / norm
  }
}

function multiply(vector, scalar) {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar
  };

}

function dotProduct(vector1, vector2) {
  return vector1.x * vector2.x + vector1.y * vector2.y;
}

function processWallCollision(state, action) {
  const {interior, exterior} = action.getState().walls;
  const {yellow, blue} = state;
  const wallCenter = {x: 0, y: 0}

  var d, person;
  for (var color of ['blue', 'yellow']) {
    person = state[color];
    d = distance(person.position, wallCenter);
    if (d >= exterior.radius - person.mass) {
      const normalizedNormalVector = subtract({x:0,y:0}, normalize(subtract(person.position, wallCenter)));
      const incidentRay = person.velocity;
      const reflectedRay = subtract(
        incidentRay,
        multiply(
          multiply(normalizedNormalVector, 2),
          dotProduct(incidentRay, normalizedNormalVector)
        )
      );
      state = Object.assign({}, state)
      state[person.color] = Object.assign({}, person, {
        velocity: reflectedRay,
        force_vector: {x:0, y:0}
      });
    }
  }
  return state;
}

function distance(vector1, vector2) {
  const diff = subtract(vector1, vector2);
  const distance_squared = diff.x * diff.x + diff.y * diff.y
  return Math.sqrt(distance_squared)
}

function circlesColide(center1, radius1, center2, radius2) {
  const diff = subtract(center1, center2);
  const min_distance = radius1 + radius2;
  return (Math.abs(diff.x) <= min_distance) &&
         (Math.abs(diff.y) <= min_distance);
}

function process_collision(yellow, blue) {
  const dx = Math.abs(yellow.position.x - blue.position.x);
  const dy = Math.abs(yellow.position.y - blue.position.y);

  //mass is the radius here..
  if (dx < (yellow.mass + blue.mass) && dy < (yellow.mass + blue.mass)) {
    const new_yellow_mass = Math.max(yellow.mass - 1, 5);
    const new_blue_mass = Math.max(blue.mass - 1, 5);
    return {
      'yellow': Object.assign({}, yellow, {
        mass: Math.max(yellow.mass - 1, 5),
        velocity: multiply(yellow.velocity, 0.9)
      }),
      'blue': Object.assign({}, blue, {
        mass: Math.max(blue.mass - 1, 5),
        velocity: multiply(blue.velocity, 0.9)
      })
    }
  } else {
    return {
      'yellow': yellow,
      'blue': blue
    }
  }
}

function calc_barycenter(person1, person2) {
  const total_mass = person1.mass + person2.mass;
  const pos1 = person1.position;
  const pos2 = person2.position;
  return {
    x: (person1.mass / total_mass) * pos1.x + (person2.mass / total_mass) * pos2.x,
    y: (person1.mass / total_mass) * pos1.y + (person2.mass / total_mass) * pos2.y
  }
}


export default function people(state = init_state, action) {
  switch (action.type) {
    case 'Timer.tick':
    state = Object.assign({}, state, process_input(state, action.getState().input));
    state = Object.assign({}, state, process_collision(state['yellow'], state['blue']));
    state = processForce(state, action);
    state = processWallCollision(state, action);
    const old_barycenter = state.barrycenter;
      state = {
        'yellow': move_person(state['yellow'], action),
        'blue': move_person(state['blue'], action)
      }
      state.barycenter = calc_barycenter(state['yellow'], state['blue']);
      return state;
    default:
      return state;
  }
}
