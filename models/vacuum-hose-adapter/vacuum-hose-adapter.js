'use strict';

const { union } = require('@jscad/modeling').booleans;
const { rotate, translate, align, mirrorZ } = require('@jscad/modeling').transforms;
const { degToRad } = require('@jscad/modeling/src').utils;

const { tube, tubeElliptic } = require('../../lib/tubes');
const cuts = require('../../lib/cuts');
const preview = require('../../lib/preview');

const sizes = require('../lib/sizes');

const main = (params) => {
  const connector1 = sizes.bosch.vacuumConnectorOrbitalSanderGSS12V13.outer;
  const connector2 = sizes.festool.hoseConnector34.outer;
  const bendAngle = degToRad(30);
  const bendLength = 18;
  const wallThickness = 2;
  const segments = 64;

  const half = (connector) => {
    const bendOuterDiameter = Math.min(connector1.diameterA, connector2.diameterA);
    const bendInnerDiameter = Math.min(connector1.diameterRingA, connector2.diameterRingA);

    const tube1 = {
      startOuterRadius: connector.diameterB / 2 + wallThickness,
      startInnerRadius: connector.diameterB / 2,
      endOuterRadius: connector.diameterA / 2 + wallThickness,
      endInnerRadius: connector.diameterA / 2,
      height: connector.distanceAB,
    };
    const tube2 = {
      startOuterRadius: connector.diameterA / 2 + wallThickness,
      startInnerRadius: connector.diameterRingA / 2,
      endOuterRadius: bendOuterDiameter / 2 + wallThickness,
      endInnerRadius: bendInnerDiameter / 2,
      height: connector.heightRingA,
    };
    const tube3 = {
      outerRadius: bendOuterDiameter / 2 + wallThickness,
      innerRadius: bendInnerDiameter / 2,
      height: bendLength / 2,
    };

    const objects = [];
    objects.push(align({}, tubeElliptic({ ...tube1, segments })));
    objects.push(translate([0, 0, tube1.height], align({}, tubeElliptic({ ...tube2, segments }))));
    objects.push(translate([0, 0, tube1.height + tube2.height], cuts.miterCutTop({ angles: [0, -bendAngle / 2] }, align({}, tube({ ...tube3, segments })))));
    return translate([tube3.outerRadius, 0, 0], union(objects));
  }

  const objects = [];
  const half1 = half(connector1);
  objects.push(rotate([0, -bendAngle / 2, 0], align({ modes: ['none', 'none', 'max'] }, half1)));
  const half2 = mirrorZ(half(connector2));
  objects.push(rotate([0, bendAngle / 2, 0], align({ modes: ['none', 'none', 'min'] }, half2)));
  return align({}, rotate([0, bendAngle / 2, 0], union(objects)));
}

module.exports = { ...preview.main({ xRay: true }, main) };
