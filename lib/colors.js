'use strict';

const { colors } = require('@jscad/modeling');
const { flatten } = require('@jscad/array-utils');

// colorize the given objects with transparent color
const transparent = (...objects) => {
  const transparentObjects = flatten(objects).map((object) => {
    const color = object.color ?? [1, 1, 1, 1];
    return colors.colorize([color[0] * 0.3, color[1] * 0.3, color[2] * 0.3, color[3] * 0.5], object);
  });
  return transparentObjects.length === 1 ? transparentObjects[0] : transparentObjects;
}

// colorize the given objects with black color
const black = (...objects) => {
  return colors.colorize([0, 0, 0, 1], objects);
}

module.exports = {
  transparent,
  black,
};
