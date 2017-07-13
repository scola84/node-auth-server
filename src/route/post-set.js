import authorize from './post-set/authorize';
import post from './post-set/post';
import validate from './post-set/validate';

export default function resetRoute(server) {
  server
    .route()
    .validate(validate())
    .authorize(authorize(server))
    .post('/scola.auth.set', post(server));
}
