import tokenUser from '../helper/token-user';

export default function tokenFilter(router, database, key) {
  router.filter((request, response, next) => {
    const header = request.header('Authorization');

    if (!header) {
      next();
      return;
    }

    const [, token] = header.split(' ');

    tokenUser(database, key, { token }, request, next);
  });
}
