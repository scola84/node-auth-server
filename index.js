import fs from 'fs';
import tokenFilter from './src/filter/token';
import passwordRoute from './src/route/password';
import tokenRoute from './src/route/token';

export { User } from '@scola/auth-common';

export function authServer(router, database, config) {
  const key = fs.readFileSync(config.auth.key);

  tokenFilter(router, database, key);
  passwordRoute(router, database, key);
  tokenRoute(router, database, key);
}
