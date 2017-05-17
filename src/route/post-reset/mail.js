export default function mail(server) {
  const dao = server.auth().dao();
  const router = server.router();
  const smtp = server.smtp();

  return (request, response, next) => {
    const user = request.connection().user();

    dao.composeResetMail(user, (message) => {
      smtp.sendMail(message, (error) => {
        if (error instanceof Error === true) {
          server.emit('error',
            router.error('500 invalid_mail ' + error.message));

          response
            .status(201)
            .end();

          return;
        }

        next();
      });
    });
  };
}
