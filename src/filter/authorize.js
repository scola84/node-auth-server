export default function authorize(allow = (u, r, c) => c(true)) {
  return (request, response, next) => {
    const user = request.connection().user();

    if (user === null) {
      next(request.error('401 invalid_user'));
      return;
    }

    allow(user, request, (result) => {
      if (result === false) {
        next(request.error('403 invalid_auth'));
        return;
      }

      next();
    });
  };
}
