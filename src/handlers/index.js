import env from 'Middleware/dotenv';
import gootAuth from 'Middleware/gootAuth';
import setVerboseMode from 'Utils/setVerboseMode';
import parseAndAuthRequest from 'Utils/parseAndAuthRequest';
import isValidJSON from 'Utils/isValidJSON';
// import { log } from 'Utils/console';

import gootParsers from './parsers';

import invalidServiceError from './errors/invalidService';
import invalidMethodError from './errors/invalidMethod';
import badRequestError from './errors/badRequest';

export default async (request, context, callback) => {
  setVerboseMode(process.env.TESTING !== 'true');
  await env();
  await gootAuth();

  let event;
  try {
    event = parseAndAuthRequest(request);
  } catch (e) {
    callback(...badRequestError(e));
    return;
  }

  const urlParts = request.path.split('/').filter((p) => !!p);

  const serviceName = urlParts[0];
  const service = gootParsers[serviceName];
  if (!service) {
    callback(...invalidServiceError(serviceName));
    return;
  }

  const methodName = urlParts[1];
  const methodFunc = service[methodName];
  if (!methodFunc) {
    callback(...invalidMethodError(methodName, serviceName, service));
    return;
  }

  try {
    const resp = await methodFunc(event.body);
    if (resp) {
      if (isValidJSON(resp)) {
        callback(null, {
          statusCode: 200,
          body: resp,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
        return;
      }
      callback(null, {
        statusCode: 200,
        body: resp,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain',
        },
      });
    }
    callback(null, {
      statusCode: 200,
      body: '',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return;
  } catch (e) {
    callback(...badRequestError(e));
  }
};
