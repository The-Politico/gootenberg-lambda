export default function defaultParser(func, payload) {
  return func(payload.id);
}
