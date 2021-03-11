export default (now) => ({
  path: '/drive/files/',
  body: {
    query: `name = "New Document – ${now}"`,
  },
});
