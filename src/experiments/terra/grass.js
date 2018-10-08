import simplex from './simplex';
import { nrand } from './gmath';

const BLADE_SEGS = 4; // # of blade segments
const BLADE_VERTS = (BLADE_SEGS + 1) * 2; // # of vertices per blade (1 side)
const BLADE_INDICES = BLADE_SEGS * 12;
const BLADE_WIDTH = 0.15;
const BLADE_HEIGHT_MIN = 2.25;
const BLADE_HEIGHT_MAX = 3.0;

export default class Grass {
    create(opts) {
        const buffers = {
            vindex: new Float32Array(BLADE_VERTS * 2),
            shape: new Float32Array(4 * opts.numBlades),
            offset: new Float32Array(4 * opts.numBlades),
            index: new Uint16Array(BLADE_INDICES)
        };
        initBladeIndices(buffers.index, 0, BLADE_VERTS, 0);
        initBladeOffsetVerts(buffers.offset, opts.numBlades, opts.radius);
        initBladeShapeVerts(buffers.shape, opts.numBlades, buffers.offset);
        initBladeIndexVerts(buffers.vindex);

        const geo = new THREE.InstancedBufferGeometry();
        geo.boundingSphere = new THREE.Sphere(
            new THREE.Vector3(0,0,0),Math.sqrt(opts.radius * opts.radius * 2.0) * 10000.0
        );
        
    }
    initBladeIndices(id, vc1, vc2, i) {
        let seg;
        for (seg = 0; seg < BLADE_SEGS; ++seg) {
            id[i++] = vc1 + 0;
            id[i++] = vc1 + 1;
            id[i++] = vc1 + 2;

            id[i++] = vc1 + 2;
            id[i++] = vc1 + 1;
            id[i++] = vc1 + 3;

            vc1 += 2;
        }

        for (seg = 0; seg < BLADE_SEGS; ++seg) {
            id[i++] = vc2 + 2; // tri 1
            id[i++] = vc2 + 1;
            id[i++] = vc2 + 0;
            id[i++] = vc2 + 3; // tri 2
            id[i++] = vc2 + 1;
            id[i++] = vc2 + 2;
            vc2 += 2;
        }
    }
    initBladeShapeVerts(shape, numBlades,offset) {
        let noise = 0;
        for(let i = 0; i< numBlades;++i){
            noise = Math.abs(simplex(offset[i * 4 + 0] * 0.03, offset[i * 4 + 1 * 0.03]));
            noise = noise * noise * noise;
            noise *= 5.0;

            shape[i*4+0] = BLADE_WIDTH + Math.random() * BLADE_WIDTH * 0.5 // width
            shape[i*4+1] = BLADE_HEIGHT_MIN + Math.pow(Math.random(), 4.0) * (BLADE_HEIGHT_MAX - BLADE_HEIGHT_MIN) + // height
                noise
            shape[i*4+2] = 0.0 + Math.random() * 0.3 // lean
            shape[i*4+3] = 0.05 + Math.random() * 0.3 // curve
        }
    }
    initBladeOffsetVerts(offset, numBlades, patchRadius) {
        for(let i = 0;i<numBlades;++i){
            offset[i * 4 + 0] = nrand() * patchRadius;
            offset[i * 4 + 1] = nrand() * patchRadius;
            offset[i * 4 + 2] = 0;
            offset[i * 4 + 3] = Math * 2.0 * Math.random();
        }
    }
    initBladeIndexVerts(vindex) {
        for(let i = 0; i < vindex.length; ++i){
            vindex[i] = i;
        }
    }
}
