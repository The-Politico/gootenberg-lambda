const AWS = !!process.env.AWS;

const getEnvVar = (name) => {
  if (process.env[name] === 'true' || process.env[name] === '1') {
    return true;
  }

  if (process.env[name] === 'false' || process.env[name] === '0') {
    return false;
  }

  if (name === 'DEVELOPMENT') {
    return true;
  }

  return false;
};

const DEVELOPMENT = getEnvVar('DEVELOPMENT');
const STAGING = getEnvVar('STAGING');
const PRODUCTION = getEnvVar('PRODUCTION');

export default {
  AWS,
  DEVELOPMENT,
  STAGING,
  PRODUCTION,
};
