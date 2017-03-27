import { ScolaError } from '@scola/error';

export default function authorize(verify = () => true) {
  return (request, response, next) => {
    const user = request.connection().user();

    if (user === null) {
      next(new ScolaError('401 invalid_user'));
      return;
    }

    if (verify(user, request) === false) {
      next(new ScolaError('403 invalid_auth'));
      return;
    }

    next();
  };
}
