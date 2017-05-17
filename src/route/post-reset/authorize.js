export default function authorize(server) {
  const dao = server.auth().dao();

  return (request, response, next) => {
    const data = request.data();

    dao.selectResetUser(data, (error, user) => {
      if (error instanceof Error === true) {
        server
          .emit('error', error);

        response
          .status(201)
          .end();

        return;
      }

      user = server
        .auth()
        .user(user);

      request
        .connection()
        .user(user);

      next();
    });
  };
}
