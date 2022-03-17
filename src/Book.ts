import type { Mesh } from 'three';

export interface Book {
  color?: number;
  obj: BookMesh;
}

export type BookMesh = Mesh & { oldPos: { x: number; y: number; z: number }, isBig: boolean };
