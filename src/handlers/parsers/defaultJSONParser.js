export default async function defaultParser(func, payload) {
  const resp = await func(payload.id);
  return JSON.stringify(resp);
}
