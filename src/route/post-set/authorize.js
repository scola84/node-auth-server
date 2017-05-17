export default function authorize(server) {
  const dao = server.auth().dao();

  return (request, response, next) => {
    const data = request.data();

    dao.selectResetToken(data, (error, user) => {
      if (error instanceof Error === true) {
        next(error);
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
