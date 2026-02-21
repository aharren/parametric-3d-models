'use strict';

const { transforms, measurements } = require('@jscad/modeling');
const { flatten } = require('@jscad/array-utils');

// put the object group's left front bottom corner at the given position
const at = (position, ...objects) => {
  return transforms.align({ modes: ['min', 'min', 'min'], relativeTo: position, grouped: true }, objects);
}

// center the object group on the x axis and y axis, and put it flat on the x-y surface
const center = (...objects) => {
  return transforms.align({ modes: ['center', 'center', 'min'], relativeTo: [0, 0, 0], grouped: true }, objects);
}

// distribute the given objects along the x, y, z axis with the given distance; use a null distance to ignore an axis
const distribute = (distances, ...objects) => {
  const input = flatten(objects);
  const output = [];
  let nextMinX = distances[0] ?? null;
  let nextMinY = distances[1] ?? null;
  let nextMinZ = distances[2] ?? null;
  const modes = [nextMinX !== null ? 'min' : 'none', nextMinY !== null ? 'min' : 'none', nextMinZ !== null ? 'min' : 'none'];
  input.forEach(object => {
    output.push(transforms.align({ modes, relativeTo: [nextMinX, nextMinY, nextMinZ] }, object));
    const dimensions = measurements.measureDimensions(object);
    nextMinX = nextMinX !== null ? nextMinX + dimensions[0] + distances[0] : null;
    nextMinY = nextMinY !== null ? nextMinY + dimensions[1] + distances[1] : null;
    nextMinZ = nextMinZ !== null ? nextMinZ + dimensions[2] + distances[2] : null;
  });
  return center(output);
}

module.exports = {
  at,
  center,
  distribute,
};
