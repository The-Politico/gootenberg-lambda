import loadEnvFromAWS from 'Utils/loadEnvFromAWS';
import dotenv from 'dotenv';

export default async () => {
  if (!process.env.AWS) {
    dotenv.config();
  }

  await loadEnvFromAWS([
    'GOOGLE_SERVICE_ACCOUNT_KEY',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOTENBERG_API_KEY',
  ]);
};
