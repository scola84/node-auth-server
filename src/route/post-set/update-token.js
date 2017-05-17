export default function updateToken(server) {
  const dao = server.auth().dao();

  return (request, response, next) => {
    const user = request.connection().user();

    dao.updateResetToken(user, (error) => {
      if (error instanceof Error === true) {
        next(error);
        return;
      }

      next();
    });
  };
}
