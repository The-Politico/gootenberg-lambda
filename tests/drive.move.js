export default (src, destination) => ({
  path: '/drive/move/',
  body: {
    src,
    destination,
  },
});
