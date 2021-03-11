export default async function sheetsCreate(func, payload) {
  const resp = await func(payload.title, payload.directory);

  return JSON.stringify(resp);
}
