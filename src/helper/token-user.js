import { verify } from 'jsonwebtoken';
import useragent from 'useragent';
import { User } from '@scola/auth-common';
import { ScolaError } from '@scola/core';

export default function tokenUser(database, key, data, request, callback) {
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

      const header = request.header('user-agent');
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
