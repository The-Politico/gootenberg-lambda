export default (now, directory) => ({
  path: '/docs/create/',
  body: {
    title: `New Document – ${now}`,
    directory,
  },
});
