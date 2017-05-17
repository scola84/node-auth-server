import authorize from './post-set/authorize';
import updatePassword from './post-set/update-password';
import updateToken from './post-set/update-token';
import respond from './post-set/respond';
import validate from './post-set/validate';

export default function resetRoute(server) {
  server
    .router()
    .post(
      '/scola.auth.set',
      validate(),
      authorize(server),
      updatePassword(server),
      updateToken(server),
      respond(server)
    )
    .extract();
}
