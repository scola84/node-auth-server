export default function updateToken(server) {
  return (request, response, next) => {
    server
      .auth()
      .dao()
      .reset()
      .updateToken(request.connection().user(), 'deleted',
        (error) => {
          if (error instanceof Error === true) {
            next(error);
            return;
          }

          next();
        });
  };
}
