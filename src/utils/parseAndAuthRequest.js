import { log } from 'Utils/console';

const INVALID_AUTH_ERROR = new Error('Invalid Auth Token Provided');
INVALID_AUTH_ERROR.statusCode = 403;

const parseBasic = (request) => {
  const AUTH_TOKEN = process.env.GOOTENBERG_API_KEY;
  if (request.token === AUTH_TOKEN) {
    return request;
  }

  throw INVALID_AUTH_ERROR;
};

const parseAPI = (request) => {
  const AUTH_TOKEN = process.env.GOOTENBERG_API_KEY;
  const { Authorization } = request.headers;
  const tokenRgx = /Token\s(.*)/.exec(Authorization);

  if (!tokenRgx) {
    throw INVALID_AUTH_ERROR;
  }

  const token = tokenRgx[1];
  if (token !== AUTH_TOKEN) {
    throw INVALID_AUTH_ERROR;
  }

  try {
    const parsedBody = JSON.parse(request.body);
    return {
      ...request,
      body: parsedBody,
    };
  } catch (e) {
    return request;
  }
};

export default (request) => {
  log('New request', 'info');
  log(JSON.stringify(request), 'info');
  if (request.httpMethod) {
    return parseAPI(request);
  }

  return parseBasic(request);
};
