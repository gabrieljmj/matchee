import { isObject, isRegExp } from './helpers';
import { ObjectPaths } from './object-paths';

export function simplyCompare<T>(a: T, b: T) {
  return a === b;
}

function compareRegExp(a: RegExp, b: RegExp) {
  return a.toString() === b.toString();
}

export function deepCompareObjects(obj1: object, obj2: object): boolean {
  const obj1IsRegExp = isRegExp(obj1);
  const obj2IsRegExp = isRegExp(obj2);

  if (obj1IsRegExp !== obj2IsRegExp) {
    return false;
  }

  if (obj1IsRegExp && obj2IsRegExp) {
    return compareRegExp(obj1, obj2);
  }

  const obj1Keys = Object.keys(obj1) as (keyof typeof obj1)[];
  const obj2Keys = Object.keys(obj2) as (keyof typeof obj2)[];
  const hasSameAmountOfKeys = obj1Keys.length === obj2Keys.length;

  if (!hasSameAmountOfKeys) {
    return false;
  }

  return obj1Keys.every((key) => {
    if (isObject(obj1[key])) {
      return deepCompareObjects(obj1[key], obj2[key]);
    }

    return (
      Object.prototype.hasOwnProperty.call(obj2, key) &&
      simplyCompare(obj1[key], obj2[key])
    );
  });
}

export function compareObjectsWithPaths(
  object: object,
  objectPaths: ObjectPaths,
) {
  const paths = Object.keys(objectPaths.paths);

  return paths.every((path) => {
    const value = path.split('.').reduce<unknown>((acc, key) => {
      if (isObject(acc) && key in acc) {
        return acc[key as keyof typeof acc];
      }

      if (typeof acc !== 'undefined') {
        return acc;
      }

      return undefined;
    }, object);

    const valueType = typeof value;
    const pathExpectedValue = objectPaths.paths[path];
    const pathType = typeof pathExpectedValue;

    if (valueType !== pathType) {
      return false;
    }

    if (valueType !== 'object') {
      return simplyCompare(value, pathExpectedValue);
    }

    return deepCompareObjects(value as object, pathExpectedValue as object);
  });
}
