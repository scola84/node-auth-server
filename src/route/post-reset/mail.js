export default function mail(server) {
  return (request, response, next) => {
    server
      .auth()
      .dao()
      .reset()
      .composeMail(request.connection().user(), (message) => {
        server
          .smtp()
          .sendMail(message, (error) => {
            if (error instanceof Error === true) {
              server.emit('error',
                request.error('500 invalid_mail ' +
                  error.message));

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
