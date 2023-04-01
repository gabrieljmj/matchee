type ObjectPath = Record<string, unknown>;

export const PATH_SEPARATOR = '.';

export class ObjectPaths {
  constructor(public readonly paths: ObjectPath) {}
}

export function objectPaths(paths: ObjectPath) {
  return new ObjectPaths(paths);
}
