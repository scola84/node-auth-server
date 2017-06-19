export default function authorize(server) {
  return (request, response, next) => {
    server
      .auth()
      .dao()
      .reset()
      .selectUser(request.data(), (error, user) => {
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
