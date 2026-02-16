'use strict';

const { colors } = require('@jscad/modeling');

// colorize the given object with transparent color
const transparent = (object) => {
  const color = object.color ?? [1, 1, 1, 1];
  return colors.colorize([color[0] * 0.3, color[1] * 0.3, color[2] * 0.3, color[3] * 0.5], object);
}

// colorize the given object with black color
const black = (object) => {
  return colors.colorize([0, 0, 0, 1], object);
}

module.exports = {
  transparent,
  black,
};
