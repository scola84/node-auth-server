import authorize from './post-reset/authorize';
import insert from './post-reset/insert';
import mail from './post-reset/mail';
import respond from './post-reset/respond';
import validate from './post-reset/validate';

export default function resetRoute(server) {
  server
    .router()
    .post(
      '/scola.auth.reset',
      validate(),
      authorize(server),
      insert(server),
      mail(server),
      respond(server)
    )
    .extract();
}
