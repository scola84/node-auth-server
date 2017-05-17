import { resetValidator } from '@scola/auth-common';

export default function validate() {
  return (request, response, next) => {
    resetValidator.validate(request.data(), next);
  };
}
