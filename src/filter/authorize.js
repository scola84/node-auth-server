import { ScolaError } from '@scola/error';

export default function authorize(roles) {
  return (request, response, next) => {
    const user = request.connection().user();

    if (!user) {
      next(new ScolaError('401 invalid_user'));
      return;
    }

    if (!user.is(roles)) {
      next(new ScolaError('403 invalid_auth'));
      return;
    }

    next();
  };
}
