import type { Mesh } from 'three';

export type BookMesh = Mesh & { oldPos: { x: number; y: number; z: number }, isBig: boolean };

export interface Book {
  color?: number;
  obj: BookMesh;
}
