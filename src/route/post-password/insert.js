import { sign } from 'jsonwebtoken';

export default function insert(server) {
  return (request, response, next) => {
    const user = request.connection().user();
    const payload = { id: user.id() };
    const key = server.auth().dao().key();
    const options = { expiresIn: user.duration() };

    sign(payload, key, options, (tokenError, token) => {
      if (tokenError instanceof Error === true) {
        next(request.error('500 invalid_sign ' +
          tokenError.message));
        return;
      }

      user.token(token);

      server
        .auth()
        .dao()
        .login()
        .insertToken(user, (databaseError) => {
          if (databaseError instanceof Error === true) {
            next(request.error('500 invalid_query ' +
              databaseError.message));
            return;
          }

          response
            .status(201)
            .end({
              user: user.toObject()
            });
        });
    });
  };
}
