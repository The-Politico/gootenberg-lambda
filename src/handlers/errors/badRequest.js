export default function badRequest(e) {
  return [
    null,
    {
      statusCode: e.statusCode || 400,
      body: e.message,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  ];
}
