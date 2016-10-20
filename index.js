import passwordModel from './src/model/password';
import tokenModel from './src/model/token';
import passwordRoute from './src/route/password';
import tokenRoute from './src/route/token';

export { User } from '@scola/auth-common';

export function authServer(router, factory, database, config) {
  passwordModel(factory, database, config);
  tokenModel(factory, database, config);

  passwordRoute(router, factory);
  tokenRoute(router, factory);
}
