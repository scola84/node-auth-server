import { compare } from 'bcrypt';
import { ScolaError } from '@scola/error';

export default function authorize(server) {
  return (request, response, next) => {
    server
      .auth()
      .dao()
      .login()
      .selectUser(request.data(), (databaseError, user) => {
        if (databaseError instanceof Error === true) {
          next(databaseError);
          return;
        }

        compare(request.datum('password'), user.password,
          (passwordError, result) => {
            if (passwordError instanceof Error === true) {
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
