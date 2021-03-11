export default async function docsAppend(func, payload) {
  const resp = await func(payload.id, payload.content);

  return JSON.stringify(resp);
}
