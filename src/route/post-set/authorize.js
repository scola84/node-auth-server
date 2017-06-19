export default function authorize(server) {
  return (request, response, next) => {
    server
      .auth()
      .dao()
      .reset()
      .selectToken(request.data(), (error, user) => {
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
