import { ArraySchema } from "@colyseus/schema";

export const mapArrayStable = <T, U>(
  arr: ArraySchema<T>,
  prev: U[] | undefined,
  mapper: (item: T, prevItem?: U) => U
): U[] => {
  const len = arr.length;
  const prevArr = prev ?? [];
  let changed = prevArr.length !== len;
  let next = changed ? Array<U>(len) : prevArr;
  for (let i = 0; i < len; i++) {
    const item = mapper(arr[i], prevArr[i]);
    if (!changed && item !== prevArr[i]) {
      changed = true;
      next = prevArr.slice(0, i);
      next[i] = item;
    } else if (changed) {
      next[i] = item;
    }
  }
  return changed ? next : prevArr;
};
