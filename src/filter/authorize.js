import { ScolaError } from '@scola/core';

export default function authorize(request, response, next) {
  const user = request.connection().user();

  if (!user) {
    next(new ScolaError('401 invalid_user'));
    return;
  }

  const path = [request.path(), request.version()]
    .filter((v) => v)
    .join('@');

  if (!user.may(request.method(), path)) {
    next(new ScolaError('403 unauthorized'));
    return;
  }

  next();
}
