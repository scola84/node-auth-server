import post from './post-token/post';
import validate from './post-token/validate';

export default function tokenRoute(server) {
  server
    .route()
    .validate(validate())
    .post('/scola.auth.token', post(server));

}
