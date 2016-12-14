import { tokenValidator } from '@scola/auth-common';
import { extract } from '@scola/core';
import tokenUser from '../helper/token-user';

export default function tokenRoute(router, database, key) {
  function validate(request, response, next) {
    next(tokenValidator.validate(request.data()));
  }

  function authorize(request, response, next) {
    tokenUser(database, key, request.data(), request, next);
  }

  function route(request, response, next) {
    response
      .once('error', next)
      .status(201)
      .end({
        user: request.connection().user().toObject()
      }, () => {
        response.removeListener('error', next);
      });
  }

  router.post(
    '/scola.auth.token',
    extract,
    validate,
    authorize,
    route
  );
}
