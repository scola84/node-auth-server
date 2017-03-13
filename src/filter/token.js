import verifyToken from '../helper/verify-token';

export default function tokenFilter(server) {
  server.router().filter((request, response, next) => {
    const header = request.header('Authorization');

    if (!header) {
      next();
      return;
    }

    const [, token] = header.split(' ');

    verifyToken(server.database(), server.auth().key(), { token },
      request, next);
  });
}
