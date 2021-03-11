export default (now, directory) => ({
  path: '/sheets/create/',
  body: {
    title: `New Sheet – ${now}`,
    directory,
  },
});
