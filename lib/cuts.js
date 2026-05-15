'use strict';

const { measureDimensions, measureBoundingBox } = require('@jscad/modeling').measurements;
const { cube, polygon } = require('@jscad/modeling').primitives;
const { subtract } = require('@jscad/modeling').booleans;
const { extrudeLinear } = require('@jscad/modeling').extrusions;
const { rotate, align, translate } = require('@jscad/modeling').transforms;
const { degToRad } = require('@jscad/modeling/src').utils;

const colorize = require('./colorize');
const grid = require('./grid');
const preview = require('./preview');

// apply a miter cut at the top of the given objects, with the given x/y angles
const miterCutTop = (options, ...objects) => {
  const angles = options.angles ?? [0, 0];
  angles.map((angle, i) => {
    angles[i] = Math.max(Math.min(angle, Math.PI / 2.5), -Math.PI / 2.5);
  });

  const boundingBox = measureBoundingBox(objects);
  const dimensions = measureDimensions(objects);

  const moveX = angles[1] > 0 ? dimensions[0] / 2 : -dimensions[0] / 2;
  const moveY = angles[0] > 0 ? dimensions[1] / 2 : -dimensions[1] / 2;

  const cut = translate([boundingBox[1][0] - dimensions[0] / 2 + moveX, boundingBox[1][1] - dimensions[1] / 2 + moveY, boundingBox[1][2]],
    rotate([angles[0], -angles[1], 0],
      align({ modes: ['center', 'center', 'min'] },
        cube({ size: Math.max(...dimensions) * 3 })
      )
    )
  );

  const results = [];
  objects.forEach(object => {
    results.push(subtract(object, cut));
  });
  return results;
};

// apply a V cut at the top of the given objects, with the given width, depth, and angle
const vCutTop = (options, ...objects) => {
  const width = options.width ?? 10;
  const depth = options.depth ?? 10;
  const angle = options.angle ?? 0;

  const boundingBox = measureBoundingBox(objects);
  const dimensions = measureDimensions(objects);

  const prism = (width, depth, height) => {
    return extrudeLinear({ height },
      polygon({ points: [[width / 2, 0], [0, depth], [-width / 2, 0]] })
    );
  }

  const cut = translate([boundingBox[1][0] - dimensions[0] / 2, boundingBox[1][1] - dimensions[1] / 2, boundingBox[1][2]],
    rotate([0, 0, angle],
      align({ modes: ['center', 'center', 'max'] },
        rotate([-Math.PI / 2, 0, Math.PI / 2],
          align({ modes: ['min', 'min', 'center'] },
            prism(width, depth, dimensions[1] * 2)
          )
        )
      )
    )
  );

  const results = [];
  objects.forEach(object => {
    results.push(subtract(object, cut));
  });
  return results;
}

const main = (params) => {
  const objects = [];

  // miterCutTop
  objects.push(colorize.red(miterCutTop({ angles: [degToRad(10), 0] }, cube({ size: 40 }))));
  objects.push(colorize.green(miterCutTop({ angles: [0, degToRad(10)] }, cube({ size: 40 }))));
  objects.push(colorize.blue(miterCutTop({ angles: [degToRad(10), degToRad(10)] }, cube({ size: 40 }))));

  // vCutTop
  objects.push(colorize.red(vCutTop({ width: 40, depth: 10 }, cube({ size: 40 }))));
  objects.push(colorize.green(vCutTop({ width: 10, depth: 10, angle: Math.PI / 2 }, cube({ size: 40 }))));
  objects.push(colorize.blue(vCutTop({ width: 20, depth: 10, angle: Math.PI / 4 }, cube({ size: 40 }))));

  return grid.distribute([10, null, null], objects);
}

module.exports = {
  ...preview.only({ ...preview.main({ xRay: false, dimensions: true }, main) }),
  miterCutTop,
};
