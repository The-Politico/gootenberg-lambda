export default function invalidService(service) {
  return [
    null,
    {
      statusCode: 404,
      body: `${service} is not a valid Gootenberg service. Use one of [docs, drive, parse, sheets].`,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  ];
}
