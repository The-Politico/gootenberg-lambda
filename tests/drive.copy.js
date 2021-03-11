export default (now, src, destination) => ({
  path: '/drive/copy/',
  body: {
    src,
    destination,
    title: `Copy Document – ${now}`,
  },
});
