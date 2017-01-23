import { tokenValidator } from '@scola/auth-common';
import { filter as extract } from '@scola/extract';
import tokenUser from '../helper/token-user';

export default function tokenRoute(server) {
  function validate(request, response, next) {
    next(tokenValidator.validate(request.data()));
  }

  function authorize(request, response, next) {
    tokenUser(server.auth(), request.data(), request, next);
  }

  function route(request, response) {
    response
      .status(201)
      .end({
        user: request.connection().user().toObject()
      });
  }

  server.router().post(
    '/scola.auth.token',
    extract,
    validate,
    authorize,
    route
  );
}
