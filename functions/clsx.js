export default function clsx(names) {
  return Object.entries(names).filter(([, val]) => val).map(([name]) => name).join(' ').trim();
}