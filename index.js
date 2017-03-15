import {
  Auth,
  User,
  load as loadAuth
} from '@scola/auth-common';

import authenticate from './src/filter/authenticate';
import authorize from './src/filter/authorize';
import postPassword from './src/route/post-password';
import postToken from './src/route/post-token';

function load(server) {
  loadAuth(server);
  postPassword(server);
  postToken(server);
}

export {
  Auth,
  User,
  authenticate,
  authorize,
  load
};
