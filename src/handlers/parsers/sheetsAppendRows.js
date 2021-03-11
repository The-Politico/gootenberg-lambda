export default async function sheetsAppendRows(func, payload) {
  try {
    await func(payload.id, payload.values, {
      valueInputOption: payload.valueInputOption,
    });
    return '';
  } catch (e) {
    return e;
  }
}
