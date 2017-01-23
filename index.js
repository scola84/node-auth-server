import { load as loadAuth } from '@scola/auth-common';
import tokenFilter from './src/filter/token';
import passwordRoute from './src/route/password';
import tokenRoute from './src/route/token';

export { default as authorize } from './src/filter/authorize';

export {
  Auth,
  User
} from '@scola/auth-common';

export function load(server) {
  loadAuth(server);
  tokenFilter(server);
  passwordRoute(server);
  tokenRoute(server);
}
