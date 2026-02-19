'use strict';

const { transforms } = require('@jscad/modeling');

// put the object group's left front bottom corner at the given position
const at = (position, ...objects) => {
  return transforms.align({ modes: ['min', 'min', 'min'], relativeTo: position, grouped: true }, objects);
}

// center the object group on the x axis and y axis, and put it flat on the x-y surface
const center = (...objects) => {
  return transforms.align({ modes: ['center', 'center', 'min'], relativeTo: [0, 0, 0], grouped: true }, objects);
}

module.exports = {
  at,
  center,
};
