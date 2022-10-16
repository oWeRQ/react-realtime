export default function keyBy(arr, mapper) {
  const obj = {};

  for (const item of arr) {
    obj[mapper(item)] = item;
  }

  return obj;
}