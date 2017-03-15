import authorize from './post-token/authorize';
import respond from './post-token/respond';
import validate from './post-token/validate';

export default function tokenRoute(server) {
  server
    .router()
    .post(
      '/scola.auth.token',
      validate(),
      authorize(server),
      respond()
    )
    .extract();
}
