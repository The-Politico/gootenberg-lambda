import Gootenberg from 'gootenberg';

let isAuthed = false;
const goot = new Gootenberg();

export const auth = async () => {
  if (isAuthed) {
    return;
  }

  await goot.auth.jwt({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  });

  isAuthed = true;
};

export default goot;
