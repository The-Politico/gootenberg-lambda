export default async function driveFiles(func, payload) {
  const resp = await func(payload.query);
  return JSON.stringify(resp);
}
