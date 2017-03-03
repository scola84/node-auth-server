import {
  Auth,
  User,
  load as loadAuth
} from '@scola/auth-common';

import authorize from './src/filter/authorize';
import tokenFilter from './src/filter/token';
import passwordRoute from './src/route/password';
import tokenRoute from './src/route/token';

function load(server) {
  loadAuth(server);
  tokenFilter(server);
  passwordRoute(server);
  tokenRoute(server);
}

export {
  Auth,
  User,
  authorize,
  load
};
