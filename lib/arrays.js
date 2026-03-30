'use strict';

const { toArray } = require('@jscad/array-utils');

const extendTo2D = (value) => {
  const a = toArray(value);
  if (a.length < 2) {
    a[1] = a[0];
  }
  return a;
}

const extendTo3D = (value) => {
  const a = toArray(value);
  if (a.length < 2) {
    a[1] = a[0];
  }
  if (a.length < 3) {
    a[2] = a[1];
  }
  return a;
}

module.exports = {
  toArray,
  extendTo2D,
  extendTo3D,
};
