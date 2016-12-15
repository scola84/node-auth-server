import tokenFilter from './src/filter/token';
import passwordRoute from './src/route/password';
import tokenRoute from './src/route/token';

export { default as authorize } from './src/filter/authorize';
export { User } from '@scola/auth-common';

export function server(router, database, key) {
  tokenFilter(router, database, key);
  passwordRoute(router, database, key);
  tokenRoute(router, database, key);
}
