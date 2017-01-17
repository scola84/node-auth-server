import { tokenValidator } from '@scola/auth-common';
import { filter as extract } from '@scola/extract';
import tokenUser from '../helper/token-user';

export default function tokenRoute(router, auth) {
  function validate(request, response, next) {
    next(tokenValidator.validate(request.data()));
  }

  function authorize(request, response, next) {
    tokenUser(auth, request.data(), request, next);
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
