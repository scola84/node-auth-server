import { verify } from 'jsonwebtoken';
import { ScolaError } from '@scola/error';

export default function verifyToken(auth, data, request,
  callback = () => {}) {

  verify(data.token, auth.key(), (tokenError, token) => {
    if (tokenError instanceof Error === true) {
      callback(new ScolaError('401 invalid_token_login ' +
        tokenError.message));
      return;
    }

    data.id = token.id;

    auth.dao().selectLoginToken(data, (databaseError, user) => {
      if (databaseError instanceof Error === true) {
        callback(databaseError);
        return;
      }

      user = auth.user(user);

      request
        .connection()
        .user(user);

      callback();
    });
  });
}
