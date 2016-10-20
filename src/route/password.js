export default function authRoutePassword(router, factory) {
  router.post('/scola.auth.password', (request, response, next) => {
    factory
      .model('scola.auth.password')
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
