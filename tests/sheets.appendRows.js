export default (id, content) => ({
  path: '/sheets/appendRows/',
  body: {
    id,
    values: [[content]],
  },
});
