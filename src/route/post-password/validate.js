import { passwordValidator } from '@scola/auth-common';

export default function validate() {
  return (request, response, next) => {
    passwordValidator.validate(request.data(), next);
  };
}
