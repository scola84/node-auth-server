import { hash } from 'bcrypt';

export default function insert(server) {
  return (request, response, next) => {
    hash(request.datum('password'), 12, (error, password) => {
      if (error instanceof Error === true) {
        next(request.error('500 invalid_hash ' + error.message));
        return;
      }

      server
        .auth()
        .dao()
        .reset()
        .updatePassword(request.connection().user(), password,
          (queryError) => {
            if (queryError instanceof Error === true) {
              next(queryError);
              return;
            }

            next();
          });
    });
  };
}
