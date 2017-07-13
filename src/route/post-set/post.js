import series from 'async/series';
import { hash } from 'bcrypt';

export default function post(server) {
  return (request, callback) => {
    series([
      (seriesCallback) => {
        hash(request.datum('password'), 12, (error, password) => {
          if (error instanceof Error === true) {
            seriesCallback(request.error('500 invalid_hash ' +
              error.message));
            return;
          }

          server
            .auth()
            .dao()
            .reset()
            .updatePassword(request.connection().user(),
              password, seriesCallback);
        });
      },
      (seriesCallback) => {
        server
          .auth()
          .dao()
          .reset()
          .updateToken(request.connection().user(),
            'deleted', seriesCallback);
      }
    ], callback);
  };
}
