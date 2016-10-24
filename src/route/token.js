import { tokenValidator } from '@scola/auth-common';
import { extractData as extract } from '@scola/api-model';
import tokenUser from '../helper/token-user';

export default function tokenRoute(router, factory, database, key) {
  function validate(request, response, next) {
    next(tokenValidator.validate(request.data()));
  }

  function authorize(request, response, next) {
    tokenUser(database, key, request.data(), request, next);
  }

  router.post('/scola.auth.token', extract, validate, authorize,
    (request, response) => {
      response.status(201).end({
        user: request.connection().user().toObject()
      });
    });
}
