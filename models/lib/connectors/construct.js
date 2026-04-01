'use strict';

const defaultHeightRingA = 10;

const TYPE_PLUG = 'plug';
const TYPE_SOCKET = 'socket';

const type = (t) => {
  return {
    type: t,
    isPlug: t === TYPE_PLUG,
    isSocket: t === TYPE_SOCKET,
  }
}

const param = (params, name) => {
  const value = (params.hasOwnProperty(name) ? params[name] : null) ?? null;
  if (value === null) {
    throw Error(`parameter '${name}' required`);
  }
  return {
    [name]: value
  };
}

const plug = (params) => {
  const object = {
    ...type(TYPE_PLUG),
    ...param(params, 'outerDiameterA'),
    ...param(params, 'outerDiameterB'),
    ...param(params, 'distanceAB'),
    ...param(params, 'innerDiameterA'),
    heightRingA: params.heightRingA ?? defaultHeightRingA,
  };
  object.wallThickness = Math.abs(object.outerDiameterA - object.innerDiameterA);
  return object;
}

const socket = (params) => {
  const object = {
    ...type(TYPE_SOCKET),
    ...param(params, 'innerDiameterA'),
    ...param(params, 'innerDiameterB'),
    ...param(params, 'distanceAB'),
    ...param(params, 'outerDiameterA'),
    heightRingA: params.heightRingA ?? defaultHeightRingA,
  };
  object.wallThickness = Math.abs(object.outerDiameterA - object.innerDiameterA);
  return object;
}

const invert = (options, object) => {
  const play = options.play ?? 0;
  switch (object.type) {
    case TYPE_PLUG:
      return socket({
        innerDiameterA: object.outerDiameterA + play,
        innerDiameterB: object.outerDiameterB + play,
        distanceAB: object.distanceAB,
        outerDiameterA: object.outerDiameterA + object.wallThickness + play,
        heightRingA: object.heightRingA,
      });
    case TYPE_SOCKET:
      return plug({
        outerDiameterA: object.innerDiameterA - play,
        outerDiameterB: object.innerDiameterB - play,
        distanceAB: object.distanceAB,
        innerDiameterA: object.innerDiameterA - object.wallThickness - play,
        heightRingA: object.heightRingA,
      });
    default:
      return {};
  }
}

module.exports = {
  plug,
  socket,
  invert,
};
