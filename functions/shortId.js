const MIN = parseInt('111111', 36);
const MAX = parseInt('zzzzzz', 36);

export default function shortId() {
  return Math.round(MIN + Math.random() * (MAX - MIN)).toString(36);
}