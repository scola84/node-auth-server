import { sign } from 'jsonwebtoken';
import { ScolaError } from '@scola/error';

export default function insert(server) {
  const dao = server.auth().dao();
  const key = server.auth().key();

  return (request, response, next) => {
    const user = request.connection().user();

    const payload = { id: user.id() };
    const options = { expiresIn: user.duration() };

    sign(payload, key, options, (tokenError, token) => {
      if (tokenError instanceof Error === true) {
        next(new ScolaError('500 invalid_token ' +
          tokenError.message));
        return;
      }

      user.token(token);

      dao.insertToken(user, (databaseError) => {
        if (databaseError instanceof Error === true) {
          next(new ScolaError('500 invalid_query ' +
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
