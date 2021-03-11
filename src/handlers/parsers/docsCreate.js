export default async function docsCreate(func, payload) {
  const resp = await func(payload.title, payload.directory);

  return JSON.stringify(resp);
}
