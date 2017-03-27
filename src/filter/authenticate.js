import verifyToken from '../helper/verify-token';

export default function authenticate(server) {
  return (request, response, next) => {
    const header = request.header('Authorization');

    if (header === null) {
      next();
      return;
    }

    const [, token] = header.split(' ');
    verifyToken(server.auth(), { token }, request, next);
  };
}
