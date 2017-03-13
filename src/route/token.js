import { tokenValidator } from '@scola/auth-common';
import { filter as extract } from '@scola/extract';
import verifyToken from '../helper/verify-token';

export default function tokenRoute(server) {
  function validate(request, response, next) {
    tokenValidator.validate(request.data(), next);
  }

  function authorize(request, response, next) {
    verifyToken(server.auth(), request.data(), request, next);
  }

  function route(request, response) {
    response
      .status(201)
      .end();
  }

  server.router().post(
    '/scola.auth.token',
    extract,
    validate,
    authorize,
    route
  );
}
