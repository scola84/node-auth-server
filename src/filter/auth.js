import { ScolaError } from '@scola/error';

export default function authorizeFilter(authorize = () => true) {
  return (request, response, next) => {
    const user = request.connection().user();

    if (!user) {
      next(new ScolaError('401 invalid_user'));
      return;
    }

    if (!authorize(user, request)) {
      next(new ScolaError('403 invalid_auth'));
      return;
    }

    next();
  };
}
