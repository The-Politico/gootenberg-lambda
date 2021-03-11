export default async function driveLs(func, payload) {
  const resp = await func(payload.id);
  return JSON.stringify(resp);
}
