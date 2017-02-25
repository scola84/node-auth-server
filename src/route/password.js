import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import useragent from 'useragent';
import { passwordValidator } from '@scola/auth-common';
import { ScolaError } from '@scola/error';
import { filter as extract } from '@scola/extract';

export default function passwordRoute(server) {
  function validate(request, response, next) {
    passwordValidator.validate(request.data(), next);
  }

  function authorize(request, response, next) {
    const data = request.data();

    server.auth().dao().selectUser(data, (databaseError, user) => {
      if (databaseError) {
        next(ScolaError.fromError(databaseError, '500 invalid_query'));
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

        user = server.auth().user(user);

        request
          .connection()
          .user(user);

        next();
      });
    });
  }

  function route(request, response, next) {
    const address = request.connection().address();
    const header = request.header('user-agent');
    const agent = useragent.parse(header);
    const user = request.connection().user();
    const duration = server.auth().dao().duration(user);

    sign({
      id: user.id()
    }, server.auth().key(), {
      expiresIn: duration
    }, (tokenError, token) => {
      if (tokenError) {
        next(new ScolaError('500 invalid_token ' + tokenError.message));
        return;
      }

      user.token(token);

      const tokenRow = {
        id: user.id(),
        state: 1,
        token: user.token(),
        address: address.address,
        agent: agent.family,
        os: agent.os.family,
        device: agent.device.family
      };

      server.auth().dao().insertToken(tokenRow, (databaseError) => {
        if (databaseError) {
          next(new ScolaError('500 invalid_query ' + databaseError.message));
          return;
        }

        response
          .status(201)
          .end({
            persistent: request.data().persistent,
            user: user.toObject()
          });
      });
    });
  }

  server.router().post(
    '/scola.auth.password',
    extract,
    validate,
    authorize,
    route
  );
}
