export default function mapBy(arr, mapper) {
  const map = new Map;

  for (const item of arr) {
    map.set(mapper(item), item);
  }

  return map;
}