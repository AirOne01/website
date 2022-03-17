// Pretty much all of this code was scrapped from https://github.com/albertopiras/threeJS-object-controls/
// Under MIT license. https://opensource.org/licenses/MIT

import type { Mesh } from 'three';

/********************* Control variables *************************/

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

let flag,
  mesh: Mesh,
  maxDistance = 15,
  minDistance = 6,
  zoomSpeed = 0.5,
  rotationSpeed = 0.05,
  rotationSpeedTouchDevices = 0.05,
  isDragging = false,
  verticalRotationEnabled = true,
  horizontalRotationEnabled = true,
  zoomEnabled = true,
  mouseFlags = { MOUSEDOWN: 0, MOUSEMOVE: 1 },
  previousMousePosition = { x: 0, y: 0 },
  prevZoomDiff = { X: null, Y: null },
  /**
   * CurrentTouches
   * length 0 : no zoom
   * length 2 : is zoomming
   */
  currentTouches = [];

/***************************** Shared functions **********************/

function rotateVertical(deltaMove, mesh) {
  if (mesh.length > 1) {
    for (let i = 0; i < mesh.length; i++) {
      rotateVertical(deltaMove, mesh[i]);
    }
    return;
  }
  mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeed;
}

function rotateHorizontal(deltaMove, mesh) {
  if (mesh.length > 1) {
    for (let i = 0; i < mesh.length; i++) {
      rotateHorizontal(deltaMove, mesh[i]);
    }
    return;
  }
  mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeed;
}

function isWithinMaxAngle(delta, axe) {
  if (MAX_ROTATON_ANGLES[axe].enabled) {
    if (mesh.length > 1) {
      let condition = true;
      for (let i = 0; i < mesh.length; i++) {
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

function isRotationWithinMaxAngles(meshToRotate, delta, axe) {
  return MAX_ROTATON_ANGLES[axe].from * -1 <
    meshToRotate.rotation[axe] + delta &&
    meshToRotate.rotation[axe] + delta < MAX_ROTATON_ANGLES[axe].to
    ? true
    : false;
}

function resetMousePosition() {
  previousMousePosition = { x: 0, y: 0 };
}

/******************  MOUSE interaction functions - desktop  *****/
function mouseDown(e) {
  isDragging = true;
  flag = mouseFlags.MOUSEDOWN;
}

function mouseMove(e) {
  if (isDragging && mesh) {
    const deltaMove = {
      x: e.offsetX - previousMousePosition.x,
      y: e.offsetY - previousMousePosition.y,
    };

    previousMousePosition = { x: e.offsetX, y: e.offsetY };

    if (horizontalRotationEnabled && deltaMove.x != 0) {
      // && (Math.abs(deltaMove.x) > Math.abs(deltaMove.y))) {
      // enabling this, the mesh will rotate only in one specific direction
      // for mouse movement
      if (!isWithinMaxAngle(Math.sign(deltaMove.x) * rotationSpeed, "y"))
        return;
      rotateHorizontal(deltaMove, mesh);
      flag = mouseFlags.MOUSEMOVE;
    }

    if (verticalRotationEnabled && deltaMove.y != 0) {
      // &&(Math.abs(deltaMove.y) > Math.abs(deltaMove.x)) //
      // enabling this, the mesh will rotate only in one specific direction for
      // mouse movement
      if (!isWithinMaxAngle(Math.sign(deltaMove.y) * rotationSpeed, "x"))
        return;
      rotateVertical(deltaMove, mesh);
      flag = mouseFlags.MOUSEMOVE;
    }
  }
}

function mouseUp() {
  isDragging = false;
  resetMousePosition();
}

/******************  Custom functions  *****/

function control(obj: Mesh) {
  mesh = obj;
}

export {
  control,
  mouseDown,
  mouseMove,
  mouseUp
}
