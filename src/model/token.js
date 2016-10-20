import fs from 'fs';
import { verify } from 'jsonwebtoken';
import useragent from 'useragent';
import { ScolaError } from '@scola/error';
import { User, tokenValidator } from '@scola/auth-common';

export default function authModelToken(factory, database, config) {
  const key = fs.readFileSync(config.auth.key);

  function validate(data, request, callback) {
    callback(tokenValidator.validate(data));
  }

  function authorize(data, request, callback) {
    verify(data.token, key, (tokenError, token) => {
      if (tokenError) {
        callback(new ScolaError('401 invalid_token ' + tokenError.message));
        return;
      }

      data.user_id = token.user_id;

      database.selectToken(data, (databaseError, user) => {
        if (databaseError) {
          callback(ScolaError.fromError(databaseError, '500 invalid_query'));
          return;
        }

        if (user.token_state > 1) {
          callback(new ScolaError('401 invalid_token Token state invalid'));
          return;
        }

        if (user.user_state > 2) {
          callback(new ScolaError('401 invalid_token User state invalid'));
        }

        const header = request.connection().socket().upgradeReq.headers['user-agent'];
        const agent = useragent.parse(header);

        if (agent.family !== user.agent ||
          agent.os.family !== user.os ||
          agent.device.family !== user.device) {

          callback(new ScolaError('401 invalid_token Agent does not match'));
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
    callback(null, {
      user: request.connection().user().toObject()
    });
  }

  factory
    .model('scola.auth.token')
    .object()
    .validate(validate)
    .authorize(authorize)
    .insert(insert);
}
