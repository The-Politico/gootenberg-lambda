export default (id) => ({
  path: '/drive/ls/',
  body: {
    id,
  },
});
