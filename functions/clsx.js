function classArray(items) {
  return items.flatMap(item => classObject(item)).filter(Boolean);
}

function classObject(items) {
  if (typeof items !== 'object' || Array.isArray(items))
    return items;

  return Object.entries(items).filter(([name, val]) => name && val).map(([name]) => name);
}

export default function clsx(...names) {
  return classArray(names).join(' ');
}