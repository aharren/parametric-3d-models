const { cuboid, sphere, cylinder } = require('@jscad/modeling').primitives;
const { intersect, subtract, union } = require('@jscad/modeling').booleans;
const { mirrorX, mirrorY, rotateX, align } = require('@jscad/modeling').transforms;
const { measureDimensions } = require('@jscad/modeling').measurements;

const colorize = require('../../lib/colorize');
const grid = require('../../lib/grid');
const config = require('../../lib/config');
const preview = require('../../lib/preview');

const main = (params) => {
  const { pipeOuterDiameter, pipeInnerDiameter, pipeConnectorLength, baseHeight, screwHoleDiameter, screeHoleEdgeDistance, wallThickness, segments, play } = config({
    params,
    defaults: {
      pipeOuterDiameter: 60,
      pipeInnerDiameter: 56,
      pipeConnectorLength: 20,
      baseHeight: 10,
      screwHoleDiameter: 5,
      screeHoleEdgeDistance: 4,
      wallThickness: 2,
      segments: 64,
      play: 0.4,
    }
  });

  const ballDiameter = pipeOuterDiameter * 1.5;
  const enclosingDiameter = ballDiameter + wallThickness * 2;
  const mountWidth = 12;
  const rotationHoleDiameter = 12;

  const ballWithSideFlattening = (space = 0) => {
    const newBallDiameter = ballDiameter + space * 2;
    const outerSphere = sphere({ radius: newBallDiameter / 2, segments });
    const cube = cuboid({ size: [newBallDiameter, newBallDiameter - wallThickness * 2, newBallDiameter] });

    return intersect(
      cube,
      outerSphere
    );
  }

  // build the ball
  const ball = () => {
    const outerSphere = ballWithSideFlattening();
    const innerPipe = cylinder({ radius: pipeInnerDiameter / 2, height: ballDiameter, segments });
    const sideMount1 = cuboid({ size: [mountWidth, wallThickness, mountWidth], center: [0, ballDiameter / 2 - wallThickness * 1 - wallThickness / 2, 0] });
    const sideMount2 = mirrorY(sideMount1);

    const ball1 = subtract(
      outerSphere,
      innerPipe,
      sideMount1,
      sideMount2,
    );

    const ball1Height = measureDimensions(ball1)[2];
    const cube = cuboid({ size: [ballDiameter, ballDiameter, ball1Height - 2] });

    return align({},
      intersect(
        cube,
        ball1,
      )
    );
  }

  // build the enclosing (one half)
  const enclosing = () => {
    const ballNegative = ballWithSideFlattening(play);
    const outerSphere = sphere({ radius: enclosingDiameter / 2, segments });

    const pipeLength = ballDiameter / 2 + pipeConnectorLength;
    const outerPipe = cylinder({ radius: pipeOuterDiameter / 2, height: pipeLength, segments, center: [0, 0, pipeLength / 2] });
    const innerPipe = cylinder({ radius: pipeInnerDiameter / 2, height: pipeLength, segments, center: [0, 0, pipeLength / 2] });

    const rotationHole = rotateX(Math.PI / 2, cylinder({ radius: rotationHoleDiameter / 2 + play, height: enclosingDiameter, segments }));

    const base = cuboid({ size: [enclosingDiameter, enclosingDiameter, baseHeight], center: [0, 0, baseHeight / 2] });
    const baseMount1 = cylinder({ radius: screwHoleDiameter / 2, height: baseHeight, segments, center: [-enclosingDiameter / 2 + screwHoleDiameter / 2 + screeHoleEdgeDistance, -enclosingDiameter / 2 + screwHoleDiameter / 2 + screeHoleEdgeDistance, baseHeight / 2] });
    const baseMount2 = mirrorX(baseMount1);
    const baseMount3 = mirrorY(baseMount2);
    const baseMount4 = mirrorX(baseMount3);

    const cube = cuboid({ size: [enclosingDiameter, enclosingDiameter, enclosingDiameter + pipeConnectorLength], center: [0, 0, enclosingDiameter / 2 + pipeConnectorLength / 2] });

    return align({},
      intersect(
        cube,
        subtract(
          union(
            outerSphere,
            outerPipe,
            base,
          ),
          innerPipe,
          ballNegative,
          rotationHole,
          baseMount1,
          baseMount2,
          baseMount3,
          baseMount4,
        )
      )
    );
  }

  const rotationElement = () => {
    const sideMountHeight = wallThickness - play;
    const rotatorMountHeight = wallThickness;
    const rotationHoleHeight = enclosingDiameter - ballDiameter + rotatorMountHeight;

    const sideMount = cuboid({ size: [mountWidth, mountWidth, sideMountHeight], center: [0, 0, sideMountHeight / 2] });

    const rotationHole = cylinder({ radius: rotationHoleDiameter / 2 - play * 2, height: rotationHoleHeight, segments, center: [0, 0, sideMountHeight + rotationHoleHeight / 2] });

    const rotatorMount1 = cuboid({ size: [mountWidth, mountWidth, rotatorMountHeight], center: [-mountWidth / 2 - wallThickness / 2, 0, sideMountHeight + rotationHoleHeight - rotatorMountHeight / 2] });
    const rotatorMount2 = mirrorX(rotatorMount1);

    return align({},
      subtract(
        union(
          sideMount,
          rotationHole,
        ),
        rotatorMount1,
        rotatorMount2,
      )
    );
  }

  return grid.distribute([20, null, null],
    colorize.red(ball()),
    colorize.blue(enclosing()),
    colorize.yellow(rotationElement())
  );
}

module.exports = { ...preview.main({ xRay: false, dimensions: true }, main), ...config(), };
