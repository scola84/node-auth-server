import { verify } from 'jsonwebtoken';
import { ScolaError } from '@scola/error';

export default function verifyToken(auth, data, request,
  callback = () => {}) {

  verify(data.token, auth.key(), (tokenError, token) => {
    if (tokenError instanceof Error === true) {
      callback(new ScolaError('401 invalid_token ' +
        tokenError.message));
      return;
    }

    data.id = token.id;

    auth.dao().selectToken(data, (databaseError, user) => {
      if (databaseError instanceof Error === true) {
        callback(databaseError);
        return;
      }

      if (user.token_state !== 1) {
        callback(new ScolaError('401 invalid_token Token state invalid'));
        return;
      }

      if (user.user_state !== 1) {
        callback(new ScolaError('401 invalid_token User state invalid'));
      }

      user = auth.user(user);

      request
        .connection()
        .user(user);

      callback();
    });
  });
}
