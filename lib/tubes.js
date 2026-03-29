'use strict';

const { cylinderElliptic } = require('@jscad/modeling').primitives;
const { subtract } = require('@jscad/modeling').booleans;

const colors = require('./colors');
const grid = require('./grid');
const preview = require('./preview');

// construct an elliptic tube with given height, start/end outer/inner radius
const tubeElliptic = (options) => {
  const height = options.height ?? 10;
  const startOuterRadius = options.startOuterRadius ?? [10, 10];
  const startInnerRadius = options.startInnerRadius ?? [8, 8];
  const endOuterRadius = options.endOuterRadius ?? startOuterRadius;
  const endInnerRadius = options.endInnerRadius ?? startInnerRadius;
  const center = options.center ?? [0, 0, 0];
  const segments = options.segments ?? 32;

  const outer = cylinderElliptic({ height, startRadius: startOuterRadius, endRadius: endOuterRadius, center, segments });
  const inner = cylinderElliptic({ height, startRadius: startInnerRadius, endRadius: endInnerRadius, center, segments });
  return subtract(outer, inner);
};

// construct a tube with given height, outer/inner radius
const tube = (options) => {
  const height = options.height ?? 10;
  const outerRadius = options.outerRadius ?? 10;
  const innerRadius = options.innerRadius ?? 8;
  const center = options.center ?? [0, 0, 0];
  const segments = options.segments ?? 32;

  return tubeElliptic({ height, startOuterRadius: [outerRadius, outerRadius], startInnerRadius: [innerRadius, innerRadius], center, segments });
};

const main = (params) => {
  const objects = [];

  // tube
  objects.push(colors.red(tube({ height: 50, outerRadius: 15, innerRadius: 12 })));

  // tubeElliptic
  objects.push(colors.green(tubeElliptic({ height: 50, startOuterRadius: [10, 10], startInnerRadius: [9, 9], endOuterRadius: [20, 20], endInnerRadius: [19, 19] })));
  objects.push(colors.blue(tubeElliptic({ height: 50, startOuterRadius: [20, 20], startInnerRadius: [8, 8], endOuterRadius: [10, 10], endInnerRadius: [8, 8] })));

  return grid.distribute([10, null, null], objects);
}

module.exports = {
  ...preview.only({ ...preview.main({ xRay: true, dimensions: true }, main) }),
  tube,
  tubeElliptic,
};
