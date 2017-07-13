import authorize from './post-password/authorize';
import post from './post-password/post';
import validate from './post-password/validate';

export default function passwordRoute(server) {
  server
    .route()
    .validate(validate())
    .authorize(authorize(server))
    .post('/scola.auth.password', post(server));
}
