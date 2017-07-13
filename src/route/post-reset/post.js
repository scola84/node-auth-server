import series from 'async/series';

export default function post(server) {
  return (request, callback) => {
    series([
      (seriesCallback) => {
        server
          .auth()
          .dao()
          .reset()
          .insertToken(request.connection().user(), seriesCallback);
      },
      (seriesCallback) => {
        server
          .auth()
          .dao()
          .reset()
          .composeMail(request.connection().user(), (message) => {
            server
              .smtp()
              .sendMail(message, seriesCallback);
          });
      },
      (seriesCallback) => {
        server
          .auth()
          .dao()
          .reset()
          .updateToken(request.connection().user(),
            'sent', seriesCallback);
      }
    ], (error) => {
      if (error) {
        server.emit('error', error);
      }

      callback();
    });
  };
}
