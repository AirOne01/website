// Pretty much all of this code was scrapped from https://github.com/albertopiras/threeJS-object-controls/
// Under MIT license. https://opensource.org/licenses/MIT

import type { Material, Mesh } from 'three';

// Magic type
type ExMesh = Material[] & Mesh;

// Control variables
const MAX_ROTATON_ANGLES = {
  x: {
    // Vertical from bottom to top.
    enabled: false,
    from: Math.PI / 8,
    to: Math.PI / 8,
  },
  y: {
    // Horizontal from left to right.
    enabled: false,
    from: Math.PI / 4,
    to: Math.PI / 4,
  },
};
let mesh: ExMesh;
const rotationSpeed = 0.05;
let isDragging = false;
const verticalRotationEnabled = true;
const horizontalRotationEnabled = true;
let previousMousePosition = { x: 0, y: 0 };

// Shared functions

function rotateVertical(deltaMove) {
  if (mesh.length > 1) {
    for (let i = 0; i < mesh.length; i += 1) {
      rotateVertical(deltaMove);
    }
    return;
  }
  mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeed;
}

function rotateHorizontal(deltaMove) {
  if (mesh.length > 1) {
    for (let i = 0; i < mesh.length; i += 1) {
      rotateHorizontal(deltaMove);
    }
    return;
  }
  mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeed;
}

function isRotationWithinMaxAngles(meshToRotate, delta, axe) {
  return MAX_ROTATON_ANGLES[axe].from * -1
    < meshToRotate.rotation[axe] + delta
    && meshToRotate.rotation[axe] + delta < MAX_ROTATON_ANGLES[axe].to;
}

function isWithinMaxAngle(delta, axe) {
  if (MAX_ROTATON_ANGLES[axe].enabled) {
    if (mesh.length > 1) {
      let condition = true;
      for (let i = 0; i < mesh.length; i += 1) {
        if (!condition) return false;
        if (MAX_ROTATON_ANGLES[axe].enabled) {
          condition = isRotationWithinMaxAngles(mesh[i], delta, axe);
        }
      }
      return condition;
    }
    return isRotationWithinMaxAngles(mesh, delta, axe);
  }
  return true;
}

function resetMousePosition() {
  previousMousePosition = { x: 0, y: 0 };
}

// MOUSE interaction functions - desktop

function mouseDown() {
  isDragging = true;
}

function mouseMove(e) {
  if (isDragging && mesh) {
    const deltaMove = {
      x: e.offsetX - previousMousePosition.x,
      y: e.offsetY - previousMousePosition.y,
    };

    previousMousePosition = { x: e.offsetX, y: e.offsetY };

    if (horizontalRotationEnabled && deltaMove.x !== 0) {
      // && (Math.abs(deltaMove.x) > Math.abs(deltaMove.y))) {
      // enabling this, the mesh will rotate only in one specific direction
      // for mouse movement
      if (!isWithinMaxAngle(Math.sign(deltaMove.x) * rotationSpeed, 'y')) return;
      rotateHorizontal(deltaMove);
    }

    if (verticalRotationEnabled && deltaMove.y !== 0) {
      // &&(Math.abs(deltaMove.y) > Math.abs(deltaMove.x)) //
      // enabling this, the mesh will rotate only in one specific direction for
      // mouse movement
      if (!isWithinMaxAngle(Math.sign(deltaMove.y) * rotationSpeed, 'x')) return;
      rotateVertical(deltaMove);
    }
  }
}

function mouseUp() {
  isDragging = false;
  resetMousePosition();
}

// Custom functions

function control(obj: Mesh) {
  mesh = obj as ExMesh;
}

function dragging() {
  return isDragging;
}

export {
  control,
  dragging,
  mouseDown,
  mouseMove,
  mouseUp,
};
