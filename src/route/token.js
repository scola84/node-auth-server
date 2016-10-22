export default function authRouteToken(router, factory) {
  router.filter((request, response, next) => {
    const header = request.header('Authorization');

    if (!header) {
      next();
      return;
    }

    const [, token] = header.split(' ');

    factory
      .model('scola.auth.token')
      .object()
      .insert()
      .data({ token }, request, next);
  });

  router.post('/scola.auth.token', (request, response, next) => {
    factory
      .model('scola.auth.token')
      .object()
      .insert()
      .request(request, (error, result) => {
        if (!error) {
          response
            .status(201)
            .end(result);
        }

        next(error);
      });
  });
}
