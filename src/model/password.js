import { compare } from 'bcrypt';
import fs from 'fs';
import { sign } from 'jsonwebtoken';
import useragent from 'useragent';
import { ScolaError } from '@scola/error';
import { User, passwordValidator } from '@scola/auth-common';

export default function authModelPassword(factory, database, config) {
  const key = fs.readFileSync(config.auth.key);

  function validate(data, request, callback) {
    callback(passwordValidator.validate(data));
  }

  function authorize(data, request, callback) {
    database.selectUser(data, (databaseError, user) => {
      if (databaseError) {
        callback(ScolaError.fromError(databaseError, '500 invalid_query'));
        return;
      }

      compare(data.password, user.password, (passwordError, result) => {
        if (passwordError) {
          callback(new ScolaError('401 invalid_password ' +
            passwordError.message));
          return;
        }

        if (result === false) {
          callback(new ScolaError('401 invalid_password'));
          return;
        }

        request.connection().user(new User()
          .id(user.user_id)
          .username(user.username)
          .roles(user.roles));

        callback();
      });
    });
  }

  function insert(data, request, callback) {
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
        callback(new ScolaError('500 invalid_token ' + tokenError.message));
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
          callback(new ScolaError('500 invalid_query ' + databaseError.message));
          return;
        }

        callback(null, {
          token,
          user: user.toObject()
        });
      });
    });
  }

  factory
    .model('scola.auth.password')
    .object()
    .validate(validate)
    .authorize(authorize)
    .insert(insert);
}
