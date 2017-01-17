import tokenUser from '../helper/token-user';

export default function tokenFilter(router, database, auth) {
  router.filter((request, response, next) => {
    const header = request.header('Authorization');

    if (!header) {
      next();
      return;
    }

    const [, token] = header.split(' ');

    tokenUser(database, auth.key(), { token }, request, next);
  });
}
