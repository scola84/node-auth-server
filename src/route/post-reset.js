import authorize from './post-reset/authorize';
import post from './post-reset/post';
import validate from './post-reset/validate';

export default function resetRoute(server) {
  server
    .route()
    .validate(validate())
    .authorize(authorize(server))
    .post('/scola.auth.reset', post(server));
}
