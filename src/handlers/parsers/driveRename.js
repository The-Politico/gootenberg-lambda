export default async function driveRename(func, payload) {
  const resp = await func(payload.id, payload.title);

  return JSON.stringify(resp);
}
