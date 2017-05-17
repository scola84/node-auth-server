export default function insert(server) {
  const dao = server.auth().dao();

  return (request, response, next) => {
    const user = request.connection().user();

    dao.insertResetToken(user, (error) => {
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
