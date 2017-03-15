import { sign } from 'jsonwebtoken';
import { ScolaError } from '@scola/error';

export default function insert(server) {
  return (request, response, next) => {
    const user = request.connection().user();
    const expiresIn = server.auth().dao().duration(user);

    const payload = { id: user.id() };
    const options = { expiresIn };

    sign(payload, server.auth().key(), options, (tokenError, token) => {
      if (tokenError) {
        next(new ScolaError('500 invalid_token ' + tokenError.message));
        return;
      }

      user.token(token);

      const tokenRow = {
        id: user.id(),
        state: 1,
        timestamp: Date.now(),
        token: user.token()
      };

      server.auth().dao().insertToken(tokenRow, (databaseError) => {
        if (databaseError) {
          next(new ScolaError('500 invalid_query ' + databaseError.message));
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
