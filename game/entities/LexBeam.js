import * as THREE from 'three';
import { Entity } from './Entity.js';
import { BLOOM_LAYER, COLORS_FLOW } from '../../shared/constants.js';

const BEAM_LIFE = 0.10;

export class LexBeam extends Entity {
  constructor(origin, target, onHit) {
    super();
    this._target = target;
    this._age    = 0;

    const points = [origin.clone(), target.position.clone()];
    this._geo = new THREE.BufferGeometry().setFromPoints(points);
    this._mat = new THREE.LineBasicMaterial({
      color: COLORS_FLOW.BEAM, transparent: true, opacity: 0.9,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.mesh = new THREE.Line(this._geo, this._mat);
    this.mesh.layers.enable(BLOOM_LAYER);

    onHit();
  }

  addToScene(scene)      { scene.add(this.mesh); }
  removeFromScene(scene) {
    scene.remove(this.mesh);
    this._geo.dispose(); this._mat.dispose();
  }

  update(delta) {
    if (!this.active) return;
    this._age += delta;
    if (this._age >= BEAM_LIFE || !this._target.active) { this.active = false; return; }

    const tp  = this._target.position;
    const pos = this._geo.attributes.position.array;
    pos[3] = tp.x; pos[4] = tp.y; pos[5] = tp.z;
    this._geo.attributes.position.needsUpdate = true;
    this._mat.opacity = 0.9 * (1 - this._age / BEAM_LIFE);
  }
}