import { passwordValidator } from '@scola/auth-common';

export default function validate() {
  return (request, callback) => {
    passwordValidator.validate(request.data(), callback);
  };
}
