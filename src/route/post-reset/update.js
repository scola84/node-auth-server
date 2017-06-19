export default function updateToken(server) {
  return (request, response, next) => {
    server
      .auth()
      .dao()
      .reset()
      .updateToken(request.connection().user(), 'sent',
        (error) => {
          if (error instanceof Error === true) {
            next(error);
            return;
          }

          next();
        });
  };
}
