export default (id) => ({
  path: '/sheets/getAll/',
  body: {
    id,
  },
});
