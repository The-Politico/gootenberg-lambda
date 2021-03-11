export default function driveExport(func, payload) {
  return func(payload.id, payload.mimeType);
}
