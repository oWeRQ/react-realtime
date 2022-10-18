export default function findMax(arr, mapper = v => v) {
  let max = -Infinity;
  let result = undefined;

  for (let item of arr) {
    const value = mapper(item);
    if (max < value) {
      max = value;
      result = item;
    }
  }

  return result;
}