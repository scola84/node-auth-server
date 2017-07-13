import { sign } from 'jsonwebtoken';

export default function insert(server) {
  return (request, callback) => {
    const user = request.connection().user();
    const payload = { id: user.id() };
    const key = server.auth().dao().key();
    const options = { expiresIn: user.duration() };

    sign(payload, key, options, (tokenError, token) => {
      if (tokenError instanceof Error === true) {
        callback(request.error('500 invalid_sign ' +
          tokenError.message));
        return;
      }

      user.token(token);

      server
        .auth()
        .dao()
        .login()
        .insertToken(user, (databaseError) => {
          callback(databaseError,
            databaseError || user.toObject());
        });
    });
  };
}
