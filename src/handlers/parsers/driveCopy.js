export default async function driveCopy(func, payload) {
  const resp = await func(payload.src, {
    destination: payload.destination,
    title: payload.title,
  });

  return JSON.stringify(resp);
}
