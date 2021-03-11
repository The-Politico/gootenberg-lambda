export default function invalidMethod(method, serviceName, service) {
  return [
    null,
    {
      statusCode: 404,
      body: `${method} is not a valid method for ${serviceName}. Use one of [${Object.keys(service).join(', ')}].`,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  ];
}
