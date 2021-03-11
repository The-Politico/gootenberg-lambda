import AWS from 'aws-sdk';

export const getParameters = async (names) => {
  const ssm = new AWS.SSM({
    region: 'us-east-1',
    credentials: new AWS.Credentials(
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY,
      process.env.AWS_SESSION_TOKEN || null,
    ),
  });

  const params = {
    Names: names,
    WithDecryption: true,
  };

  return new Promise((resolve, reject) => {
    ssm.getParameters(params, (err, data) => {
      if (err) {
        reject(err);
      }

      const reduction = data.Parameters.reduce((acc, current) => {
        acc[current.Name] = current.Value;
        return acc;
      }, {});

      resolve(reduction);
    });
  });
};

export const loadEnv = async (names, override = false) => {
  const params = await getParameters(names);

  Object.entries(params).forEach(([param, value]) => {
    if (override || !Object.hasOwnProperty.call(process.env, param)) {
      process.env[param] = value;
    }
  });
};

export default loadEnv;
