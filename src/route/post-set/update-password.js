import { hash } from 'bcrypt';

export default function insert(server) {
  const dao = server.auth().dao();
  const router = server.router();

  return (request, response, next) => {
    const user = request.connection().user();
    const password = request.datum('password');

    hash(password, 12, (error, hashedPassword) => {
      if (error instanceof Error === true) {
        next(router.error('500 invalid_hash ' + error.message));
        return;
      }

      dao.updatePassword(user, hashedPassword, (queryError) => {
        if (queryError instanceof Error === true) {
          next(queryError);
          return;
        }

        next();
      });
    });
  };
}
