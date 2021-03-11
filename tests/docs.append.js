export default (id, content) => ({
  path: '/docs/append/',
  body: {
    id,
    content,
  },
});
