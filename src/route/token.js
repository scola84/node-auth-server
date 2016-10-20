export default function authRouteToken(router, factory) {
  router.post('/scola.auth.token', (request, response, next) => {
    factory
      .model('scola.auth.token')
      .object()
      .insert()
      .execute(request, (error, result) => {
        if (!error) {
          response
            .status(201)
            .end(result);
        }

        next(error);
      });
  });
}
