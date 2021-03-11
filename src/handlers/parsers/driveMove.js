export default async function driveMove(func, payload) {
  const resp = await func(payload.src, payload.destination);

  return JSON.stringify(resp);
}
