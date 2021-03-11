export default (now, id) => ({
  path: '/drive/rename/',
  body: {
    id,
    title: `Renamed Document – ${now}`,
  },
});
