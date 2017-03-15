import { compare } from 'bcrypt';
import { ScolaError } from '@scola/error';

export default function authorize(server) {
  return (request, response, next) => {
    const data = request.data();

    server.auth().dao().selectUser(data, (databaseError, user) => {
      if (databaseError) {
        next(databaseError);
        return;
      }

      compare(data.password, user.password, (passwordError, result) => {
        if (passwordError) {
          next(new ScolaError('401 invalid_credentials ' +
            passwordError.message));
          return;
        }

        if (result === false) {
          next(new ScolaError('401 invalid_credentials'));
          return;
        }

        user = server
          .auth()
          .user(user);

        request
          .connection()
          .user(user);

        next();
      });
    });
  };
}
