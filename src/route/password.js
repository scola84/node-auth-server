import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import useragent from 'useragent';
import { ScolaError } from '@scola/error';
import { User, passwordValidator } from '@scola/auth-common';
import { extractData as extract } from '@scola/api-model';

export default function passwordRoute(router, factory, database, key) {
  function validate(request, response, next) {
    next(passwordValidator.validate(request.data()));
  }

  function authorize(request, response, next) {
    const data = request.data();

    database.selectUser(data, (databaseError, user) => {
      if (databaseError) {
        next(ScolaError.fromError(databaseError, '500 invalid_query'));
        return;
      }

      compare(data.password, user.password, (passwordError, result) => {
        if (passwordError) {
          next(new ScolaError('401 invalid_password ' +
            passwordError.message));
          return;
        }

        if (result === false) {
          next(new ScolaError('401 invalid_password'));
          return;
        }

        request.connection().user(new User()
          .id(user.user_id)
          .username(user.username)
          .roles(user.roles));

        next();
      });
    });
  }

  router.post('/scola.auth.password', extract, validate, authorize,
    (request, response, next) => {
      const address = request.connection().address();
      const header = request.header('user-agent');
      const agent = useragent.parse(header);
      const user = request.connection().user();
      const duration = database.duration(user);

      sign({
        user_id: user.id()
      }, key, {
        expiresIn: duration
      }, (tokenError, token) => {
        if (tokenError) {
          next(new ScolaError('500 invalid_token ' + tokenError.message));
          return;
        }

        const tokenRow = {
          user_id: user.id(),
          state: 1,
          token,
          address: address.address,
          agent: agent.family,
          os: agent.os.family,
          device: agent.device.family
        };

        database.insertToken(tokenRow, (databaseError) => {
          if (databaseError) {
            next(new ScolaError('500 invalid_query ' + databaseError.message));
            return;
          }

          response.status(201).end({
            token,
            user: user.toObject()
          });
        });
      });
    });
}
