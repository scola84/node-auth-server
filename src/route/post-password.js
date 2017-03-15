import authorize from './post-password/authorize';
import insert from './post-password/insert';
import validate from './post-password/validate';

export default function passwordRoute(server) {
  server
    .router()
    .post(
      '/scola.auth.password',
      validate(),
      authorize(server),
      insert(server)
    )
    .extract();
}
