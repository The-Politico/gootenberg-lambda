import path from 'path';
import env from './environment';

export const TMP_DIR = env.AWS
  ? '/tmp/' : path.join(__dirname, '../tmp/');

export const DATABASE_PATH = path.join(TMP_DIR, 'databases');
