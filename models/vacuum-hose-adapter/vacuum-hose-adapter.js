'use strict';

const { rotate, translate, align, mirrorZ } = require('@jscad/modeling').transforms;
const { degToRad } = require('@jscad/modeling/src').utils;

const { tube, tubeElliptic } = require('../../lib/tubes');
const cuts = require('../../lib/cuts');
const visuals = require('../../lib/visuals');
const preview = require('../../lib/preview');

const connectors = require('../lib/connectors');

const main = (params) => {
  const connectTo1 = connectors.bosch.vacuumConnectorOrbitalSanderGSS12V13.plug;
  const connectTo2 = connectors.festool.hoseConnector34.plug;
  //const connectTo1 = connectors.test.o30i25.plug;
  //const connectTo2 = connectors.test.o30i25.socket;

  const bendAngle = degToRad(30);
  const bendLength = 18;
  const wallThickness = 2;
  const segments = 64;

  const connector = (c) => {
    const r = {};
    r.outerRadiusA = c.isPlug ? c.outerDiameterA / 2 + wallThickness : c.innerDiameterA / 2;
    r.innerRadiusA = r.outerRadiusA - wallThickness;
    r.outerRadiusB = c.isPlug ? c.outerDiameterB / 2 + wallThickness : c.innerDiameterB / 2;
    r.innerRadiusB = r.outerRadiusB - wallThickness;
    r.distanceAB = c.distanceAB;
    r.outerRadiusRingA = c.isPlug ? c.outerDiameterA / 2 + wallThickness : c.outerDiameterA / 2;
    r.innerRadiusRingA = c.isPlug ? c.innerDiameterA / 2 : c.innerDiameterA / 2 - wallThickness;
    r.heightRingA = c.heightRingA ?? 5;
    return r;
  }
  const connector1 = connector(connectTo1);
  const connector2 = connector(connectTo2);

  const half = (c, mirror) => {
    const bendOuterRadius = Math.min(connector1.outerRadiusRingA, connector2.outerRadiusRingA);
    const bendInnerRadius = Math.min(connector1.innerRadiusRingA, connector2.innerRadiusRingA);
    const tube1 = {
      startOuterRadius: c.outerRadiusB,
      startInnerRadius: c.innerRadiusB,
      endOuterRadius: c.outerRadiusA,
      endInnerRadius: c.innerRadiusA,
      height: c.distanceAB,
    };
    const tube2 = {
      startOuterRadius: c.outerRadiusRingA,
      startInnerRadius: c.innerRadiusRingA,
      endOuterRadius: bendOuterRadius,
      endInnerRadius: bendInnerRadius,
      height: c.heightRingA,
    };
    const tube3 = {
      outerRadius: bendOuterRadius,
      innerRadius: bendInnerRadius,
      height: bendLength / 2,
    };

    const objects = [];
    objects.push(align({}, tubeElliptic({ ...tube1, segments })));
    objects.push(translate([0, 0, tube1.height], align({}, tubeElliptic({ ...tube2, segments }))));
    if (tube3.height > 0) {
      objects.push(translate([0, 0, tube1.height + tube2.height], cuts.miterCutTop({ angles: [0, -bendAngle / 2] }, align({}, tube({ ...tube3, segments })))));
    }

    objects.push(preview.only(visuals.dimensions({ modes: ['none', 'none', 'right'], distance: 2, dimensions: [0, 0, tube1.height], mirror: [false, false, !mirror] }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['bottom', 'none', 'left'], distance: 2, dimensions: [tube1.startOuterRadius * 2, 0, 0] }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['bottom', 'none', 'none'], distance: 8, dimensions: [tube1.startInnerRadius * 2, 0, 0] }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['top', 'none', 'none'], distance: 2, dimensions: [tube1.endOuterRadius * 2, 0, 0] }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['top', 'none', 'none'], distance: 8, dimensions: [tube1.endInnerRadius * 2, 0, 0] }, objects[0])));

    const result = translate([tube3.outerRadius, 0, 0], objects);
    return mirror ? mirrorZ(result) : result;
  }

  const objects = [];
  const half1 = half(connector1, false);
  objects.push(rotate([0, -bendAngle / 2, 0], align({ modes: ['none', 'none', 'max'], grouped: true }, half1)));
  const half2 = half(connector2, true);
  objects.push(rotate([0, bendAngle / 2, 0], align({ modes: ['none', 'none', 'min'], grouped: true }, half2)));
  return align({ grouped: true }, rotate([0, bendAngle / 2, 0], objects));
}

module.exports = { ...preview.main({ xRay: true, dimensions: false }, main) };
