import tokenUser from '../helper/token-user';

export default function tokenFilter(server) {
  server.router().filter((request, response, next) => {
    const header = request.header('Authorization');

    if (!header) {
      next();
      return;
    }

    const [, token] = header.split(' ');

    tokenUser(server.database(), server.auth().key(), { token },
      request, next);
  });
}
