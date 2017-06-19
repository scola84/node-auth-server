export default function insert(server) {
  return (request, response, next) => {
    server
      .auth()
      .dao()
      .reset()
      .insertToken(request.connection().user(), (error) => {
        if (error instanceof Error === true) {
          server
            .emit('error', error);

          response
            .status(201)
            .end();

          return;
        }

        next();
      });
  };
}
