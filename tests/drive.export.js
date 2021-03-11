export default (id) => ({
  path: '/drive/export/',
  body: {
    id,
  },
});
